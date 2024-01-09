import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {
        backlog: [],
        inProgress: [],
        complete: [],
      },
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }


  fetchClientsData() {
    fetch('http://localhost:3001/api/v1/clients')
      .then((response) => response.json())
      .then((data) => {
        // sort the data by priority
        data.sort((a, b) => a.priority - b.priority);
        const clients = data.map((clientDetails) => ({
          id: clientDetails.id,
          name: clientDetails.name,
          description: clientDetails.description,
          status: clientDetails.status,
          priority: clientDetails.priority,
        }));

        this.setState({
          clients: {
            backlog: clients.filter((client) => !client.status || client.status === 'backlog'),
            inProgress: clients.filter((client) => client.status && client.status === 'in-progress'),
            complete: clients.filter((client) => client.status && client.status === 'complete'),
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }
  componentDidMount() {
    this.initializeDragula();
    this.fetchClientsData();
  }

  initializeDragula() {
    const containers = Object.values(this.swimlanes).map(ref => ref.current);
  
    const drake = Dragula(containers);
  
    drake.on('drop', (el, target) => {
      console.log('drop - target:', target);

      const newPriority = Array.from(target.children).findIndex(child => child === el) + 1;
      console.log('newPriority:', newPriority);
  
      // Check if the target has the dataset property
      let swimlaneStatus = null;
      const progressTitle = target.parentElement.firstChild.textContent;
      if (progressTitle === 'Backlog') {
        swimlaneStatus = 'backlog';
      } else if (progressTitle === 'In Progress') {
        swimlaneStatus = 'in-progress';
      } else if (progressTitle === 'Complete') {
        swimlaneStatus = 'complete';
      }
  
      if (swimlaneStatus) {
        // Update the status of the dragged card
        const cardId = el.dataset.id;
  
        // Make the fetch request to update the status in the backend
        fetch(`http://localhost:3001/api/v1/clients/${cardId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: swimlaneStatus, priority: newPriority }),
        })
          .then(response => response.json())
          .then(updatedClient => {
            // Update the state with the response from the backend
            const updatedClients = this.state.clients;
            Object.keys(updatedClients).forEach(swimlane => {
              updatedClients[swimlane] = updatedClients[swimlane].map(client => {
                if (client.id === cardId) {
                  return { ...client, status: updatedClient.status };
                }
                return client;
              });
            });
  
            this.setState({ clients: updatedClients });
          })
          .catch(error => {
            console.error('Error updating status:', error);
          });
      }
    });
  }
  
  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

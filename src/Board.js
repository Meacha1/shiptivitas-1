import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'inProgress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  componentDidMount() {
    this.initializeDragula();
  }

  initializeDragula() {
    const containers = Object.values(this.swimlanes).map(ref => ref.current);
  
    const drake = Dragula(containers);
  
    drake.on('over', (el, container, source, target) => {
      const closestWithDataStatus = el.closest('[data-status]');

      const swimlaneStatus = closestWithDataStatus ? closestWithDataStatus.dataset.status : null;
  
      if (swimlaneStatus) {
        const clientId = el.dataset.id;
  
        this.setState(prevState => {
          let updatedClients = { ...prevState.clients };

          const target = updatedClients[swimlaneStatus];

          let index = -1

          for (let i = 0; i < target.length; i++) {
            if (target[i].id === clientId) {
              index = i;
              break;
            }
          }
          if (index !== -1) {
            updatedClients[swimlaneStatus][index].status = swimlaneStatus;
          }
          return { clients: updatedClients };
        });
      }
    });
  }


  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'inProgress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'inProgress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'inProgress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'inProgress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'inProgress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    const color = this.getColorForSwimlane(name);
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref} color={color} />
    );
  }
  getColorForSwimlane(name) {
    switch (name.toLowerCase()) {
      case 'backlog':
        return 'grey';
      case 'in progress':
        return 'blue';
      case 'complete':
        return 'green';
      default:
        return '';
    }
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

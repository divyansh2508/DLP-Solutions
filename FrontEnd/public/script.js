document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems,{});
    cc = document.querySelector('.tabs');
    var instance = M.Tabs.init(cc, {});
    
    

});
const ctx = document.getElementById('pieChart');
nInsertion = 0
nEjection = 0
nCREATE = 0
nREAD = 0
nUPDATE = 0
nDELETE = 0
let myChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: ['Insertion', 'Ejection', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
      datasets: [{
        label: '# of events in nimbus@144.243.56.24',
        data: [nInsertion,nEjection,nCREATE,nREAD,nUPDATE,nDELETE],
        // borderWidth: 1,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)'
        ]     
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Function to fetch new events from MongoDB
  function getNewEventsFromMongoDB() {
    fetch('http://localhost:3000/getNewEventsFromMongoDB') // Fetch data from the MongoDB
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Handle non-OK responses
            }
            return response.clone().json(); // Clone the response and parse the JSON from the cloned response
        })
        .then(data => {
            console.log('New Events:', data); // Log the retrieved data
            // Update the UI
            appendEventList(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error); // Handle errors
        });
}


getNewEventsFromMongoDB();
// Call the function to fetch new events from MongoDB

  /*function getOldEvents() {
    fetch('http://localhost:3000/getOldLogs', ) // Fetch data from the server
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok'); // Handle non-OK responses
        }
        return response.json(); // Parse the JSON from the response
      })
      .then(data => {
        data.map((d)=>{
            console.log('New Events:', d); // Log the retrieved data
            appendEventList(d);
        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error); // Handle errors
      });

  }*/
  function appendEventList(data){
    let icon = '';
    let statusColor = 'red';
    let textColor = 'white';
    console.log(data);
    if(data.eventType === 'insertion'){
        icon = 'usb';
        statusColor = 'blue';
    }
    else if(data.eventType === 'ejection'){
        icon = 'exit_to_app';
        statusColor = 'grey';
        textColor = 'black'
    }
    // else if(data.event.toLowerCase() == 'create'){
    //     icon = 'edit';
    //     statusColor = 'green';
    // }
    // else if(data.event.toLowerCase() == 'read'){
    //     icon = 'visibility';
    //     statusColor = 'yellow';
    //     textColor = 'black';
        
    // }
    // else if(data.event.toLowerCase() == 'update'){
    //     icon = 'update';
    //     statusColor = 'red';
    // }
    // else if(data.event.toLowerCase() == 'delete'){
    //     icon = 'delete_forever';
    //     statusColor = 'black';
    // }
    tt = new Date(data.timestamp);
    tt = tt.getHours() + ':' + tt.getMinutes() + ':' + tt.getSeconds();
    let _s = `<li>
    <div class="collapsible-header"><i class="material-icons">${icon}</i>${data.event}</div>
    <div class="collapsible-body">
      <h6>User : ${data.user} <span class="badge ${statusColor} lighten-2 ${textColor}-text">${tt}</span></h6>
      <h6>Device : ${data.device}</h6>
    </div>
    </li>`;
    // Append to previour list
    let eventList = document.getElementById('myeventlist');
    eventList.innerHTML += _s;
    updateGraph(data);
    M.toast({html: `New ${data.event} @ ${data.device}`});
  }
  // Call the function to fetch new events
  function updateGraph(data){
    function addData() {
        // chart.data.labels.push(label);
        myChart.data.datasets[0] = {
            label: '# of events in nimbus@144.243.56.24',
            data: [nInsertion,nEjection,nCREATE,nREAD,nUPDATE,nDELETE],
            borderWidth: 1
        };
        myChart.update('none');
    }
    // if(data.event.toLowerCase() == 'insertion'){
        nInsertion = data.insertion.length;
    // }
    // else if(data.event.toLowerCase() == 'ejection'){
        nEjection = data.ejection.length;
    // }
    // else if(data.event.toLowerCase() == 'create'){
    //     nCREATE++;
    // }
    // else if(data.event.toLowerCase() == 'read'){
    //     nREAD++;
    // }
    // else if(data.event.toLowerCase() == 'update'){
    //     nUPDATE++;
    // }
    // else if(data.event.toLowerCase() == 'delete'){
    //     nDELETE++;
    // }
    addData();
  }
const helper = require('./helper.js');

let searchInfo = {
    from: '',
    to: '',
    date: 'YYYY-MM-DD',
    numTickets: 1,
    type: 'economy',
}
const getFlights = () => {
    console.log(searchInfo);
}


const InfoInput = () => {
    return (
    <div id="infoLayout">
        <form id="infoInput">
            <div className="infoSec">
            <label>From:</label>
            <input id="from" onChange={() => {searchInfo.from = document.getElementById("from").value}}/>
            <label>To:</label>
            <input id="to" onChange={() => {searchInfo.to = document.getElementById("to").value}}/>
            </div>
            <div className="infoSec">
            <label>Enter Date in YYYY-MM-DD Format:</label>
            <input id="date" onChange={() => {searchInfo.date = document.getElementById("date").value}}/>
            </div>
            <div className="infoSec">
            <label>Number of Tickets:</label>
            <input type="number" id="numTickets" min="0" max="20" onChange={() => {searchInfo.numTickets = document.getElementById("numTickets").value}}/>
            </div>
        </form>
    </div>
    )
}
const init = async() => {
ReactDOM.render(<InfoInput />, document.getElementById('searchFlights'))
}

window.onload = init;
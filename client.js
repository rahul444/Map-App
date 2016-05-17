var SearchBar = React.createClass({
  getInitialState: function() {
    return {
      value: ""
    };
  },

  handleChange: function(evt) {
    this.setState({
      value: evt.target.value
    });
  },

  handleInput: function() {
    search(this.state.value);
  },

  render: function() {
    return (
      <div>
        <input value={this.state.value} onChange={this.handleChange} placeholder = 'Search by Zipcode or City' />
        <button onClick={this.handleInput}>Search</button>
      </div>
    );
  }
});

var VenueList = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Venues Found: </h1>
                <ul>
                    {this.props.list.map((v) => {
                        return <VenueItem venue = {v}/>
                    })}
                </ul>
            </div>
        );
    }
});

var VenueItem = React.createClass({
    render: function() {
        return (
            <li>
                <h3>{this.props.venue.name}</h3>
                <h4>{this.props.venue.address}</h4>
            </li>
        );
    }
})

ReactDOM.render(<SearchBar />, document.getElementById('app'));


function search(query) {
    $.get('/search', {searchQuery : query},
      function(data) {
        if (data.length == 0) {
            alert('Invalid zipcode or location, try again.');
        } else {
            displayLocations(data);
        }
      }
    );
}

function displayLocations(data) {
    for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
    }

    ReactDOM.render(
        <div>
            <SearchBar />
            <VenueList list = {data} />
        </div>,
        document.getElementById('app'));
}

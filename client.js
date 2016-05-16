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
        <input value={this.state.value} onChange={this.handleChange} maxLength = '5' placeholder = 'Search by Zipcode' />
        <button onClick={this.handleInput}>Search</button>
      </div>
    );
  }
});

var LocationComponent = React.createClass({
    render: function() {
        return (
            <h1>Name of Location: {this.props.name}</h1>
        );
    }
});

ReactDOM.render(
    <div>
        <SearchBar />
        <LocationComponent name = "De Anza" />
    </div>,
    document.getElementById('app'));


function search(zip) {
    $.get('/search', {zipcode : zip},
      function(data) {
        if (data.length == 0) {
            alert('Invalid zipcode, try again');
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
}

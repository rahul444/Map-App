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

ReactDOM.render(
  <SearchBar />,
  document.getElementById('app')
);

function search(zip) {
    $.get('/search', {zipcode : zip},
      function(data) {
        console.log('lon: ' + data['lon']);
        console.log('lat: ' + data['lat']);
      }
    );
}

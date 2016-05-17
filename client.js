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
        <input value={this.state.value} onChange={this.handleChange} placeholder='Search by Zipcode or City' />
        <button type='button' onClick={this.handleInput}>Search</button>
      </div>
    );
  }
});

var VenueList = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Venues Found: </h1>
                <ul class='venue-list'>
                    {this.props.list.map((v) => {
                        return <VenueItem venue = {v}/>
                    })}
                </ul>
            </div>
        );
    }
});

var VenueItem = React.createClass({
    getInitialState: function() {
        return {exanded: false};
    },

    expandInfo: function() {
        this.setState({
            expanded: !this.state.expanded
        });
    },

    getMoreInfo: function() {
        if (this.state.expanded) {
            return <div style={{marginTop: '-15px'}}>
                <ul>
                    <li style={{listStyleType: 'none'}}>Address: {this.props.venue.address}</li>
                    <li style={{listStyleType: 'none'}}>Category: {this.props.venue.type}</li>
                    <li style={{listStyleType: 'none'}}>Contact: {this.props.venue.contact}</li>
                </ul>
                <CommentList />
                <CommentBox onComment={this.handleComment} />
            </div>;
        } else {
            return null;
        }
    },

    handleComment: function(comp, event) {
        alert(comp.state.value);
    },

    render: function() {
        var moreInfo = this.getMoreInfo();
        return (
            <li style={{listStyleType: 'none'}}>
                <h3 onClick={this.expandInfo} style={{color: 'green'}}>{this.props.venue.name}</h3>
                {moreInfo}
            </li>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        return(
            <h4>complete comments</h4>
        )
    }
});

var CommentBox = React.createClass({
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

    render: function() {
        return (
            <form>
                <div>
                    <br></br>
                    <textarea placeholder='Enter a comment here.' id='comments' rows='4' cols='50' onChange={this.handleChange} ></textarea>
                </div>
                <button type='button' onClick={this.props.onComment.bind(null, this)}>Comment</button>
            </form>
        )
    }
});

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
            <VenueList list={data} />
        </div>,
        document.getElementById('app'));
}

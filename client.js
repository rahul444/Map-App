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
                <CommentList comments={this.props.venue.comments}/>
                <CommentBox onComment={this.handleComment} />
            </div>;
        } else {
            return null;
        }
    },

    handleComment: function(comp, event) {
        if (comp.state.name.length < 1) {
            alert('Please enter name');
        } else if (comp.state.value.length < 1) {
            alert('Please enter a comment');
        } else {
            comment(this.props.venue.name, comp.state.name, comp.state.value);
            // TODO implement adding comment to CommentList
            // TODO implment storing comments in db
            // TODO implment rendering comments from db on reload
        }
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
            <div style={{marginTop: '15px', marginBottom:'10px', height:'400px', width:'504px', overflowY:'auto', border:'2px solid #2E8B57'}}>
                {this.props.comments.map((c) => {
                    return <div style={{width:'448px', height:'70px', border:'1px solid #000', marginTop:'1px', marginLeft:'18px'}}>{c}</div>
                })}
            </div>
        )
    }
});

var CommentBox = React.createClass({
    getInitialState: function() {
      return {
        name: '',
        value: ''
      };
    },

    handleChange: function(evt) {
      this.setState({
        value: evt.target.value
      });
    },

    handleNameChange: function(evt) {
        this.setState({
            name: evt.target.value
        });
    },

    render: function() {
        return (
            <form>
                <div>
                    Name: <input onChange={this.handleNameChange} placeholder='Enter name' style={{marginBottom:'3px'}} /> <br></br>
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

function comment(venueName, user, text) {
    $.get('/comment', {venue: venueName, name: user, comment: text},
        function(res) {
            console.log(res);
        }
    );
}

function displayLocations(data) {
    ReactDOM.render(
        <div>
            <SearchBar />
            <VenueList list={data} />
        </div>,
        document.getElementById('app'));
}

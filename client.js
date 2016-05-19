// Component to allow user to enter a search query
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
      <div style={{width: '100%', height:'55px', backgroundColor:'#54C769'}}>
        <span style={{position:'absolute', fontSize:'44px', color:'white'}}>Venue Search</span>
        <input value={this.state.value} onChange={this.handleChange} placeholder='Search by Zipcode or City'
            style={{marginLeft:'40%', marginTop:'25px'}} />
        <button type='button' onClick={this.handleInput}>Search</button>
      </div>
    );
  }
});

// Component to display a list of venues based on search query
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

// Component that keeps track of all information for a venue
var VenueItem = React.createClass({
    getInitialState: function() {
        return {exanded: false, views: this.props.venue.views, comments: this.props.venue.comments};
    },

    expandInfo: function() {
        if (!this.state.expanded) {
            incrementViews(this.props.venue.name, this.state.views + 1);
            this.setState({
                expanded: true,
                views: this.state.views + 1
            });
        } else {
            this.setState({
                expanded: !this.state.expanded
            });
        }
    },

    updateCommentList: function(comment) {
        var arr = this.state.comments.slice();
        arr.unshift(comment);
        this.setState({
            comments: arr
        })
    },

    getMoreInfo: function() {
        if (this.state.expanded) {
            return (
                <div style={{marginTop:'-15px', marginLeft:'25px'}}>
                    <span style={{color:'#2E8B57', fontSize:'18px'}}>More Info:</span>
                    <ul>
                        <li style={{listStyleType: 'none'}}>Views: {this.state.views}</li>
                        <li style={{listStyleType: 'none'}}>Address: {this.props.venue.address}</li>
                        <li style={{listStyleType: 'none'}}>Type: {this.props.venue.type}</li>
                        <li style={{listStyleType: 'none'}}>Contact: {this.props.venue.contact}</li>
                    </ul>
                    <CommentList comments={this.state.comments}/>
                    <CommentBox onComment={this.handleComment} />
                </div>
            );
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
            var commentId = this.state.comments.length + 1;
            comment(this.props.venue.name, comp.state.name, comp.state.value, this.state.views, commentId);
            this.updateCommentList({name: comp.state.name, comment: comp.state.value, id: commentId});
        }
    },

    render: function() {
        var moreInfo = this.getMoreInfo();
        return (
            <li style={{listStyleType: 'none'}}>
                <h3 onClick={this.expandInfo} style={{color:'green'}}>{this.props.venue.name}</h3>
                {moreInfo}
            </li>
        );
    }
});

// Component to display all comments for a given venue
var CommentList = React.createClass({
    render: function() {
        return (
            <div style={{marginTop:'8px'}}>
                <span style={{color:'#2E8B57', fontSize:'18px'}}>Comments:</span>
                <div style={{marginTop: '8px', marginBottom:'10px', height:'400px', width:'504px',
                    overflowY:'auto', border:'2px solid #2E8B57'}}>
                    {this.props.comments.map((c) => {
                        return <div style={{width:'448px', height:'75px', border:'1px solid #000', overflowY:'auto',
                         marginTop:'1px', marginLeft:'18px'}}>{c.comment}<br></br>
                                <span style={{color:'grey', fontStyle:'italic'}}>- {c.name}</span>
                         </div>
                    })}
                </div>
            </div>
        );
    }
});

// Component for entering and submitting comments
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
                    Name: <input onChange={this.handleNameChange} placeholder='Enter name' style={{marginBottom:'3px'}} />
                    <br></br>
                    <textarea placeholder='Enter a comment here.' id='comments' rows='4' cols='50'
                        onChange={this.handleChange} ></textarea>
                </div>
                <button type='button' onClick={this.props.onComment.bind(null, this)}>Comment</button>
            </form>
        );
    }
});

ReactDOM.render(<SearchBar />, document.getElementById('app'));

function displayLocations(data) {
    ReactDOM.render(
        <div>
            <SearchBar />
            <VenueList list={data} />
        </div>,
        document.getElementById('app'));
}


// Gets venues for the query from backend
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

// Sends new comment for a venue to the backend
function comment(venueName, user, text, views, id) {
    $.get('/comment', {venue: venueName, name: user, comment: text, views: views, id: id},
        function(res) {
            console.log(res);
        }
    );
}

// Sends new number of views for a venue to the backend
function incrementViews(name, views) {
    $.get('/views', {venueName: name, views: views},
        function(res) {
            console.log(res);
        }
    );
}

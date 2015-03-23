/*
 * Main container:
 *   - handle GET to fetch all status list
 *   - handle POST to add status
 *   - display the app page
 */
var Main = React.createClass({
    // initialization
    getInitialState: function() {
        return {
            data: []
        }
    },

    componentDidMount: function() {
        this.getPosts();
        setInterval(this.getPosts, this.props.refreshInt);
    },

    // utilities methods
    getPosts: function() {
        $.ajax({
            url      : this.props.url,
            dataType : 'json',
            success  : this.onPostsCallSuccess,
            error    : this.onPostsCallError
        });
    },

    // event handlers
    onPostsCallSuccess: function(data) {
        this.setState({data: data});
    },

    onPostsCallError: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
    },


    onNewPost: function(post) {
        var posts = this.state.data,
            newPosts = posts.concat([post]);
        this.setState({data: newPosts});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: post,
            success: this.onPostsCallSuccess,
            error: this.onPostsCallError
        });
    },

    // rendering
    render: function() {
        return (
            <div className="main">
                <NewStatusForm onNewPost={this.onNewPost} />
                <StatusList data={this.state.data} />
            </div>
        );
    }
});


/*
 * List:
 *  - display list of status
 */
var StatusList = React.createClass({

    // rendering
    render: function() {
        var statusPosts = _.sortBy(this.props.data, 'created_time').reverse()
        statusPosts = statusPosts.map(function(post) {
            return (
                <li className="list-group-item">
                    <StatusPost message={post.message} created={post.created_time} username={post.username}>{post.message}</StatusPost>
                </li>
            );
        });
        return (
            <ul className="list-group">
                {statusPosts}
            </ul>
        );
    }
});


/*
 * Form:
 *   - handle new status submit
 */
var NewStatusForm = React.createClass({

    // event handlers
    handleSubmit: function(e) {
        e.preventDefault();

        var usernameNode = this.refs.username,
            messageNode  = this.refs.message,
            username     = React.findDOMNode(usernameNode).value.trim(),
            message      = React.findDOMNode(messageNode).value.trim();

        if (!username || !message)
        {
            return;
        }

        this.props.onNewPost({
            username: username,
            message: message,
            created_time: +new Date
        });
        React.findDOMNode(usernameNode).value = '';
        React.findDOMNode(messageNode).value = '';
        return;
    },

    // rendering
    render: function() {
        return (
            <form className="form-horizontal center-block" onSubmit={this.handleSubmit}>
                <input className="form-control input-lg" type="text" placeholder="Your username" ref="username" />
                <div className="input-group">
                    <input className="form-control input-lg" placeholder="What's happening?" ref="message" type="text" />
                    <div className="input-group-btn">
                        <input className="btn btn-lg btn-primary" type="submit" value="Post" />
                    </div>
                </div>
            </form>
        );
    }
});


/*
 * Post:
 *   - display a status
 */
var StatusPost = React.createClass({

    // rendering
    render: function() {
        return (
            <div className="status-post">
                <h4>{this.props.username}</h4>
                <p>{this.props.message}</p>
                <small className="text-muted">{moment(parseInt(this.props.created)).fromNow()}</small>
            </div>
        );
    }
});


// Init the app page
React.render(
  <Main url="posts.json" refreshInt={3000} />,
  document.getElementById('main')
);

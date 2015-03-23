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

    onLogout: function() {
        Parse.User.logOut();
        renderAuthView();
    },

    // rendering
    render: function() {
        return (
            <div className="main">
                <h2 className="text-muted">Hi {Parse.User.current().getUsername()}! <button onClick={this.onLogout} className="btn btn-default btn-xs">Logout</button></h2>
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

        var messageNode  = this.refs.message,
            message      = React.findDOMNode(messageNode).value.trim(),
            username = Parse.User.current().getUsername();

        if (!username || !message)
        {
            return;
        }

        this.props.onNewPost({
            username: username,
            message: message,
            created_time: +new Date
        });
        React.findDOMNode(messageNode).value = '';
        return;
    },

    // rendering
    render: function() {
        return (
            <form className="form-horizontal center-block" onSubmit={this.handleSubmit}>
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


/*
 * Authentication
 */
var AuthenticationForm = React.createClass({

    // handle signin
    createAccount: function(data) {
        var user = new Parse.User();
        user.set('username', data.username);
        user.set('password', data.password);
        user.set('email', data.email);

        user.signUp(null, {
            success: function(user) {
                renderFeedView();
            },
            error: function(user, error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },

    onCreateAccount: function(e) {
        e.preventDefault();

        var username = React.findDOMNode(this.refs.username).value.trim(),
            email    = React.findDOMNode(this.refs.email).value.trim(),
            password = React.findDOMNode(this.refs.password).value.trim();

        this.createAccount({
            username: username,
            email: email,
            password: password
        });
    },

    // handle login
    login: function(data) {
        Parse.User.logIn(data.username, data.password, {
            success: function(user) {
                renderFeedView();
            },
            error: function(user, error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },

    onLogin: function(e) {
        e.preventDefault();

        var username = React.findDOMNode(this.refs.log_username).value.trim(),
            password = React.findDOMNode(this.refs.log_password).value.trim();

        this.login({
            username: username,
            password: password
        });
    },

    render: function() {
        return (
            <div className="authentication-form">
                <h3>Sign-in !</h3>
                <form className="form-inline" onSubmit={this.onCreateAccount}>
                    <div className="form-group"><input className="input-lg form-control" type="text" ref="username" placeholder="Username" /></div>
                    <div className="form-group"><input className="input-lg form-control" type="text" ref="email" placeholder="Email" /></div>
                    <div className="form-group"><input className="input-lg form-control" type="password" ref="password" placeholder="Password" /></div>
                    <div className="form-group"><input className="btn btn-primary" type="submit" value="Create my account!" /></div>
                </form>
                <h3>Login</h3>
                <form className="form-inline" onSubmit={this.onLogin}>
                    <div className="form-group"><input className="input-lg form-control" type="text" ref="log_username" placeholder="Username" /></div>
                    <div className="form-group"><input className="input-lg form-control" type="password" ref="log_password" placeholder="Password" /></div>
                    <div className="form-group"><input className="btn btn-primary" type="submit" value="Login" /></div>
                </form>
            </div>
        );
    }
});

// Init the app page
Parse.initialize("t4UoMELz7WY339ZMMRMdhuRXi8u0U5gBhKg7m977", "xI3WhlPFvfy3Nkfk5MR1es1ODUNFEf3UfUTHN9j6");

var renderAuthView = function() {
    React.render(
        <AuthenticationForm />,
        document.getElementById('main')
    );
}

var renderFeedView = function() {
    React.render(
      <Main url="posts.json" refreshInt={3000} />,
      document.getElementById('main')
    );
}

if (Parse.User.current()) {
    renderFeedView();
} else {
    renderAuthView();
}

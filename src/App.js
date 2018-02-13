import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import zenscroll from "zenscroll";
import Waypoint from "react-waypoint";

import "./App.css";

class WayPointWrapper extends React.Component {
  // VENDOR DEPENDENCIES:
  // react-waypoint
  // zenscroll
  // PROJECT DEPENDENCIES:
  // project history object

  componentDidMount() {
    window.shouldScroll = true;
    window.onpopstate = e =>
      // this timeout fixes back button, but not foreward button
      setTimeout(() => {
        WayPointWrapper.scrollToActive(window.location.pathname);
      }, 20);
  }

  static propTypes = {
    path: PropTypes.string
  };

  static contextTypes = {
    history: PropTypes.object
  };

  pushRoute = route => {
    if (!zenscroll.moving()) {
      this.context.history.push(route);
    }
  };

  static scrollToActive = path => {
    if (window.shouldScroll) {
      // error handler - no waypoints
      // enhancement opportunity - check if waypoints are on page
      if (!document.getElementById(path)) {
        console.log("no scroll points on page");
      } else {
        zenscroll.center(document.getElementById(path));
      }
    }
  };

  static snapToActive = path => {
    if (window.shouldScroll) {
      // error handler - no waypoints
      // enhancement opportunity - check if waypoints are on page
      if (!document.getElementById(path)) {
        console.log("no scroll points on page");
      } else {
        zenscroll.center(document.getElementById(path), 0);
      }
    }
  };

  render() {
    return (
      <Waypoint
        onEnter={() => {
          if (!zenscroll.moving()) {
            window.shouldScroll = false;
            this.pushRoute(this.props.path);
            window.shouldScroll = true;
          }
        }}
        topOffset={window.innerHeight / 2}
        bottomOffset={window.innerHeight / 2 - 1}
      >
        <div id={this.props.path}>{this.props.children}</div>
      </Waypoint>
    );
  }
}

const NavLinks = () => (
  <nav>
    <div>
      {/* home links */}
      {homeRoutes.map(route => (
        <Link key={route} to={route}>
          {route}
        </Link>
      ))}
    </div>
    <div>
      {/* location links */}
      {nycRoutes.map(route => (
        <Link key={route} to={route}>
          {route}
        </Link>
      ))}
    </div>
    <div>
      <Link to="/non-scrolling-page">/non-scrolling-page</Link>
    </div>
  </nav>
);

// Home comonents

const Header = props => (
  <div className="deafault-node">
    <h1>home - {props.content}</h1>
    <p>lorem ipsum</p>
  </div>
);

const About = props => (
  <div className="deafault-node">
    <h1>about - {props.content}</h1>
    <p>lorem ipsum</p>
  </div>
);

const Contact = props => (
  <div className="deafault-node">
    <h1>contact - {props.content}</h1>
    <p>lorem ipsum</p>
  </div>
);

const News = props => (
  <div className="deafault-node">
    <h1>news - {props.content}</h1>
    <p>lorem ipsum</p>
  </div>
);

const Gallery = props => (
  <div className="deafault-node">
    <h1>gallery - {props.content}</h1>
    <p>lorem ipsum</p>
  </div>
);

const NonScrollPage = props => (
  <div className="deafault-node non-scrolling-page">
    <h1>non-scroll</h1>
    <p>non scroll</p>
  </div>
);

class Home extends React.Component {
  getChildContext() {
    return { history: this.props.history };
  }

  static childContextTypes = {
    history: PropTypes.object
  };

  componentDidMount() {
    WayPointWrapper.snapToActive(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    WayPointWrapper.scrollToActive(nextProps.location.pathname);
  }

  render() {
    return (
      <div>
        <WayPointWrapper path="/">
          <Header content="home" />
        </WayPointWrapper>

        <WayPointWrapper path="/about">
          <About content="home" />
        </WayPointWrapper>

        <WayPointWrapper path="/contact">
          <Contact content="home" />
        </WayPointWrapper>

        <WayPointWrapper path="/news">
          <News content="home" />
        </WayPointWrapper>

        <WayPointWrapper path="/gallery">
          <Gallery content="home" />
        </WayPointWrapper>
      </div>
    );
  }
}

class Location extends React.Component {
  getChildContext() {
    return { history: this.props.history };
  }

  static childContextTypes = {
    history: PropTypes.object
  };

  componentDidMount() {
    WayPointWrapper.snapToActive(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    WayPointWrapper.scrollToActive(nextProps.location.pathname);
  }

  render() {
    return (
      <div>
        <WayPointWrapper path="/nyc">
          <Header content="nyc" />
        </WayPointWrapper>

        <WayPointWrapper path="/nyc/about">
          <About content="nyc" />
        </WayPointWrapper>

        <WayPointWrapper path="/nyc/contact">
          <Contact content="nyc" />
        </WayPointWrapper>

        <WayPointWrapper path="/nyc/news">
          <News content="nyc" />
        </WayPointWrapper>

        <WayPointWrapper path="/nyc/gallery">
          <Gallery content="nyc" />
        </WayPointWrapper>
      </div>
    );
  }
}

const homeRoutes = ["/", "/about", "/contact", "/news", "/gallery"];
const nycRoutes = [
  "/nyc",
  "/nyc/about",
  "/nyc/contact",
  "/nyc/news",
  "/nyc/gallery"
];

const App = () => (
  <Router onChange={e => console.log(e)}>
    <div>
      <NavLinks />
      <Switch>
        {homeRoutes.map(path => {
          // giving a same key stops app from re-mounting. which is GOOD
          return <Route exact key="home" path={path} component={Home} />;
        })}
        {nycRoutes.map(path => (
          <Route exact key="nyc" path={path} component={Location} />
        ))}
        <Route exact path="/non-scrolling-page" component={NonScrollPage} />
      </Switch>
    </div>
  </Router>
);

export default App;

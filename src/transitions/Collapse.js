// @flow weak

import React, { Component, PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import classNames from 'classnames';
import Transition from '../internal/Transition';

const reflow = (elem) => elem.offsetHeight;

export const styleSheet = createStyleSheet('Collapse', (theme) => {
  return {
    container: {
      height: 0,
      overflow: 'hidden',
      transition: theme.transitions.create('height'),
    },
    entered: {
      height: 'auto',
      transitionDuration: '0ms',
    },
  };
});

export default class Collapse extends Component {
  static propTypes = {
    /**
     * The content node to be collapsed.
     */
    children: PropTypes.node,
    /**
     * Class name passed to the wrapping container
     * required for holding+measuring the expanding content
     */
    containerClassName: PropTypes.string,
    /**
     * Set to true to transition in
     */
    in: PropTypes.bool,
    /**
     * Callback fired before the component is entering
     */
    onEnter: PropTypes.func,
    /**
     * Callback fired when the component is entering
     */
    onEntering: PropTypes.func,
    /**
     * Callback fired when the component has entered
     */
    onEntered: PropTypes.func, // eslint-disable-line react/sort-prop-types
    /**
     * Callback fired before the component is exiting
     */
    onExit: PropTypes.func,
    /**
     * Callback fired when the component is exiting
     */
    onExiting: PropTypes.func,
    /**
     * Callback fired when the component has exited
     */
    onExited: PropTypes.func, // eslint-disable-line react/sort-prop-types
    /**
     * Set to 'auto' to automatically calculate transition time based on height
     */
    transitionDuration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  static defaultProps = {
    in: false,
    transitionDuration: 300,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  wrapper = null;

  handleEnter = (element) => {
    element.style.height = '0px';
    if (this.props.onEnter) {
      this.props.onEnter(element);
    }
  };

  handleEntering = (element) => {
    const { transitionDuration } = this.props;
    const wrapperHeight = this.wrapper ? this.wrapper.clientHeight : 0;

    if (transitionDuration === 'auto') {
      const { getAutoHeightDuration } = this.context.styleManager.theme.transitions;
      element.style.transitionDuration = `${getAutoHeightDuration(wrapperHeight)}ms`;
    } else if (typeof transitionDuration === 'number') {
      element.style.transitionDuration = `${transitionDuration}ms`;
    } else {
      element.style.transitionDuration = transitionDuration;
    }

    element.style.height = `${wrapperHeight}px`;

    if (this.props.onEntering) {
      this.props.onEntering(element);
    }
  };

  handleEntered = (element) => {
    element.style.transitionDuration = '0ms'; // safari fix
    element.style.height = 'auto';
    reflow(element);
    if (this.props.onEntered) {
      this.props.onEntered(element);
    }
  };

  handleExit = (element) => {
    const wrapperHeight = this.wrapper ? this.wrapper.clientHeight : 0;
    element.style.height = `${wrapperHeight}px`;
    if (this.props.onExit) {
      this.props.onExit(element);
    }
  };

  handleExiting = (element) => {
    const { transitionDuration } = this.props;
    const wrapperHeight = this.wrapper ? this.wrapper.clientHeight : 0;

    if (transitionDuration) {
      if (transitionDuration === 'auto') {
        const { getAutoHeightDuration } = this.context.styleManager.theme.transitions;
        element.style.transitionDuration = `${getAutoHeightDuration(wrapperHeight)}ms`;
      } else if (typeof transitionDuration === 'number') {
        element.style.transitionDuration = `${transitionDuration}ms`;
      } else {
        element.style.transitionDuration = transitionDuration;
      }
    }

    element.style.height = '0px';
    if (this.props.onExiting) {
      this.props.onExiting(element);
    }
  };

  render() {
    const {
      children,
      containerClassName,
      onEnter, // eslint-disable-line no-unused-vars
      onEntering, // eslint-disable-line no-unused-vars
      onExit, // eslint-disable-line no-unused-vars
      onExiting, // eslint-disable-line no-unused-vars
      transitionDuration, // eslint-disable-line no-unused-vars
      ...other,
    } = this.props;

    const classes = this.context.styleManager.render(styleSheet);
    const containerClasses = classNames(classes.container, containerClassName);

    return (
      <Transition
        onEntering={this.handleEntering}
        onEnter={this.handleEnter}
        onEntered={this.handleEntered}
        enteredClassName={classes.entered}
        onExiting={this.handleExiting}
        onExit={this.handleExit}
        {...other}
      >
        <div className={containerClasses}>
          <div ref={(c) => this.wrapper = c}>
            {children}
          </div>
        </div>
      </Transition>
    );
  }
}

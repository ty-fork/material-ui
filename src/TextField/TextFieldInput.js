// @flow weak

import React, { Component, PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import shallowEqual from 'recompose/shallowEqual';
import classNames from 'classnames';

export const styleSheet = createStyleSheet('TextFieldInput', (theme) => {
  const { palette } = theme;
  return {
    root: {
      font: 'inherit',
      padding: '6px 0',
      border: 0,
      display: 'inline-block',
      verticalAlign: 'middle',
      whiteSpace: 'normal',
      background: 'none',
      lineHeight: 1,
      appearance: 'textfield', // Improve type search style.
      '&:focus': {
        outline: 0,
      },
      '&::-webkit-search-decoration': { // Remove the padding when type=search.
        appearance: 'none',
      },
    },
    disabled: {
      color: palette.text.disabled,
      cursor: 'not-allowed',
    },
    underline: {
      borderBottom: `1px solid ${palette.text.divider}`,
      '&disabled': {
        borderBottomStyle: 'dotted',
      },
    },
  };
}, { index: 5 });

/**
 * TextFieldInput
 */
export default class TextFieldInput extends Component {
  static muiName = 'TextFieldInput';

  static propTypes = {
    /**
     * The CSS class name of the root element.
     */
    className: PropTypes.string,
    /**
     * The element or component used for the root node.
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    disabled: PropTypes.bool,
    /**
     * @ignore
     */
    onChange: PropTypes.func,
    /**
     * @ignore
     */
    onClean: PropTypes.func,
    /**
     * @ignore
     */
    onDirty: PropTypes.func,
    /**
     * TextFieldInput type
     */
    type: PropTypes.string,
    /**
     * If set to true, the input will have an underline
     */
    underline: PropTypes.bool,
    /**
     * The input value, required for a controlled component
     */
    value: PropTypes.string,
  };

  static defaultProps = {
    component: 'input',
    type: 'text',
    underline: true,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  componentWillMount() {
    if (this.isControlled()) {
      this.checkDirty(this.props);
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.context, nextContext)
    );
  }

  componentWillUpdate(nextProps) {
    this.checkDirty(nextProps);
  }

  // Holds the input reference
  input = undefined;

  handleChange = (event) => {
    if (!this.isControlled()) {
      this.checkDirty(this.input);
    }
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  isControlled() {
    return typeof this.props.value === 'string';
  }

  isDirty(obj) {
    return obj && obj.value && obj.value.length > 0;
  }

  checkDirty(obj) {
    if (this.props.onDirty && this.isDirty(obj)) {
      this.props.onDirty();
    } else if (this.props.onClean) {
      this.props.onClean();
    }
  }

  render() {
    const {
      className: classNameProp,
      component,
      disabled,
      onChange, // eslint-disable-line no-unused-vars
      onDirty, // eslint-disable-line no-unused-vars
      onClean, // eslint-disable-line no-unused-vars
      type,
      underline,
      ...other,
    } = this.props;

    const classes = this.context.styleManager.render(styleSheet);

    const className = classNames({
      [classes.root]: true,
      [classes.underline]: underline,
      [classes.disabled]: disabled,
    }, classNameProp);

    const inputProps = {
      ref: (c) => this.input = c,
      className,
      onChange: this.handleChange,
      disabled,
      ...other,
    };

    if (component === 'input' || typeof component === 'function') {
      inputProps.type = type;
    }

    return React.createElement(component, inputProps);
  }
}

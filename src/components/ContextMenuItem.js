import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Pressable} from 'react-native';
import MenuItem from './MenuItem';
import Tooltip from './Tooltip';
import Icon from './Icon';
import styles from '../styles/styles';
import * as StyleUtils from '../styles/StyleUtils';
import getButtonState from '../libs/getButtonState';

const propTypes = {
    /** Icon Component */
    icon: PropTypes.elementType.isRequired,

    /** Text to display */
    text: PropTypes.string.isRequired,

    /** Icon to show when interaction was successful */
    successIcon: PropTypes.elementType,

    /** Text to show when interaction was successful */
    successText: PropTypes.string,

    /** Whether to show the mini menu */
    isMini: PropTypes.bool,

    /** Callback to fire when the item is pressed */
    onPress: PropTypes.func.isRequired,

    /** Automatically reset the success status */
    autoReset: PropTypes.bool,

    /** A description text to show under the title */
    description: PropTypes.string,
};

const defaultProps = {
    isMini: false,
    successIcon: null,
    successText: '',
    autoReset: false,
    description: '',
};

class ContextMenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
        };
        this.triggerPressAndUpdateSuccess = this.triggerPressAndUpdateSuccess.bind(this);
    }

    componentWillUnmount() {
        if (!this.successResetTimer) {
            return;
        }

        clearTimeout(this.successResetTimer);
    }

    /**
     * Called on button press and mark the run
     */
    triggerPressAndUpdateSuccess() {
        if (this.state.success) {
            return;
        }
        this.props.onPress();

        // We only set the success state when we have icon or text to represent the success state
        // We may want to replace this check by checking the Result from OnPress Callback in future.
        if (this.props.successIcon || this.props.successText) {
            this.setState({
                success: true,
            });
            if (this.props.autoReset) {
                this.successResetTimer = setTimeout(() => this.setState({success: false}), 1800);
            }
        }
    }

    render() {
        const icon = this.state.success ? this.props.successIcon || this.props.icon : this.props.icon;
        const text = this.state.success ? this.props.successText || this.props.text : this.props.text;
        return (
            this.props.isMini
                ? (
                    <Tooltip text={text}>
                        <Pressable
                            focusable
                            accessibilityLabel={text}
                            onPress={this.triggerPressAndUpdateSuccess}
                            style={
                                ({hovered, pressed}) => [
                                    styles.reportActionContextMenuMiniButton,
                                    StyleUtils.getButtonBackgroundColorStyle(getButtonState(hovered, pressed, this.state.success)),
                                ]
                            }
                        >
                            {({hovered, pressed}) => (
                                <Icon
                                    src={icon}
                                    fill={StyleUtils.getIconFillColor(getButtonState(hovered, pressed, this.state.success))}
                                />
                            )}
                        </Pressable>
                    </Tooltip>
                ) : (
                    <MenuItem
                        title={text}
                        icon={icon}
                        onPress={this.triggerPressAndUpdateSuccess}
                        wrapperStyle={styles.pr9}
                        success={this.state.success}
                        description={this.props.description}
                    />
                )
        );
    }
}

ContextMenuItem.propTypes = propTypes;
ContextMenuItem.defaultProps = defaultProps;

export default ContextMenuItem;

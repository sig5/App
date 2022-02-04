import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';
import {CONST} from 'expensify-common/lib/CONST';
import Picker from './Picker';
import * as FormUtils from '../libs/FormUtils';
import withLocalize, {withLocalizePropTypes} from './withLocalize';

const STATES = _.map(CONST.STATES, ({stateISO}) => ({
    value: stateISO,
    label: stateISO,
}));

const propTypes = {
    /** The label for the field */
    label: PropTypes.string,

    /** A callback method that is called when the value changes and it received the selected value as an argument */
    onChange: PropTypes.func.isRequired,

    /** The value that needs to be selected */
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /** Indicates that the input is being used with the Form component */
    isFormInput: PropTypes.bool,

    /**
     * The ID used to uniquely identify the input
     *
     * @param {Object} props - props passed to the input
     * @returns {Object} - returns an Error object if isFormInput is supplied but inputID is falsey or not a string
     */
    inputID: props => FormUtils.getInputIDPropTypes(props),

    /** Saves a draft of the input value when used in a form */
    shouldSaveDraft: PropTypes.bool,

    errorText: PropTypes.bool,

    ...withLocalizePropTypes,
};

const defaultProps = {
    label: '',
    value: '',
    isFormInput: false,
    shouldSaveDraft: false,
    errorText: '',
};

const StatePicker = props => (
    <Picker
        placeholder={{value: '', label: '-'}}
        items={STATES}
        onChange={props.onChange}
        value={props.value}
        label={props.label || props.translate('common.state')}
        errorText={props.errorText}
    />
);

StatePicker.propTypes = propTypes;
StatePicker.defaultProps = defaultProps;
StatePicker.displayName = 'StatePicker';

export default withLocalize(StatePicker);

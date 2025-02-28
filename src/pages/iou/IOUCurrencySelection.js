import React, {Component} from 'react';
import {SectionList, View} from 'react-native';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import _ from 'underscore';
import styles from '../../styles/styles';
import * as PersonalDetails from '../../libs/actions/PersonalDetails';
import ONYXKEYS from '../../ONYXKEYS';
import * as OptionsListUtils from '../../libs/OptionsListUtils';
import Text from '../../components/Text';
import OptionRow from '../../components/OptionRow';
import TextInput from '../../components/TextInput';
import Navigation from '../../libs/Navigation/Navigation';
import ScreenWrapper from '../../components/ScreenWrapper';
import HeaderWithCloseButton from '../../components/HeaderWithCloseButton';
import compose from '../../libs/compose';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import CONST from '../../CONST';
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView';
import Button from '../../components/Button';
import FixedFooter from '../../components/FixedFooter';
import * as IOU from '../../libs/actions/IOU';
import * as CurrencySymbolUtils from '../../libs/CurrencySymbolUtils';
import {withNetwork} from '../../components/OnyxProvider';
import networkPropTypes from '../../components/networkPropTypes';

/**
 * IOU Currency selection for selecting currency
 */
const propTypes = {

    // The personal details of the person who is logged in
    myPersonalDetails: PropTypes.shape({

        // Local Currency Code of the current user
        localCurrencyCode: PropTypes.string,
    }),

    /** Holds data related to IOU */
    iou: PropTypes.shape({

        // Selected Currency Code of the current IOU
        selectedCurrencyCode: PropTypes.string,
    }),

    // The currency list constant object from Onyx
    currencyList: PropTypes.objectOf(PropTypes.shape({
        // Symbol for the currency
        symbol: PropTypes.string,

        // Name of the currency
        name: PropTypes.string,

        // ISO4217 Code for the currency
        ISO4217: PropTypes.string,
    })),

    /** Information about the network from Onyx */
    network: networkPropTypes.isRequired,
    ...withLocalizePropTypes,

};

const defaultProps = {
    myPersonalDetails: {
        localCurrencyCode: CONST.CURRENCY.USD,
    },
    iou: {
        selectedCurrencyCode: CONST.CURRENCY.USD,
    },
    currencyList: {},
};

class IOUCurrencySelection extends Component {
    constructor(props) {
        super(props);

        const {currencyOptions} = OptionsListUtils.getCurrencyListForSections(this.getCurrencyOptions(this.props.currencyList),
            '');

        this.state = {
            searchValue: '',
            currencyData: currencyOptions,
            toggledCurrencyCode: this.props.iou.selectedCurrencyCode || this.props.myPersonalDetails.localCurrencyCode,
        };
        this.getCurrencyOptions = this.getCurrencyOptions.bind(this);
        this.toggleOption = this.toggleOption.bind(this);
        this.getSections = this.getSections.bind(this);
        this.confirmCurrencySelection = this.confirmCurrencySelection.bind(this);
        this.changeSearchValue = this.changeSearchValue.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.network.isOffline || this.props.network.isOffline) {
            return;
        }

        this.fetchData();
    }

    /**
     * Returns the sections needed for the OptionsSelector
     *
     * @param {Boolean} maxParticipantsReached
     * @returns {Array}
     */
    getSections() {
        const sections = [];

        sections.push({
            title: this.props.translate('iOUCurrencySelection.allCurrencies'),
            data: this.state.currencyData,
            shouldShow: true,
            indexOffset: 0,
        });

        return sections;
    }

    /**
     *
     * @returns {Object}
     */
    getCurrencyOptions() {
        const currencyListKeys = _.keys(this.props.currencyList);
        const currencyOptions = _.map(currencyListKeys, currencyCode => ({
            text: `${currencyCode} - ${CurrencySymbolUtils.getLocalizedCurrencySymbol(this.props.preferredLocale, currencyCode)}`,
            searchText: `${currencyCode} ${this.props.currencyList[currencyCode].symbol}`,
            currencyCode,
        }));
        return currencyOptions;
    }

    fetchData() {
        PersonalDetails.getCurrencyList();
    }

    /**
     * Function which toggles a currency in the list
     *
     * @param {String} toggledCurrencyCode
     *
     */
    toggleOption(toggledCurrencyCode) {
        this.setState({toggledCurrencyCode});
    }

    /**
     * Sets new search value
     * @param {String} searchValue
     * @return {void}
     */
    changeSearchValue(searchValue) {
        const {currencyOptions} = OptionsListUtils.getCurrencyListForSections(
            this.getCurrencyOptions(this.props.currencyList),
            searchValue,
        );
        this.setState({
            searchValue,
            currencyData: currencyOptions,
        });
    }

    /**
     * Confirms the selection of currency and sets values in Onyx
     * @return {void}
     */
    confirmCurrencySelection() {
        IOU.setIOUSelectedCurrency(this.state.toggledCurrencyCode);
        Navigation.goBack();
    }

    render() {
        return (
            <ScreenWrapper onTransitionEnd={() => {
                if (!this.textInput) {
                    return;
                }

                this.textInput.focus();
            }}
            >
                <KeyboardAvoidingView>
                    <HeaderWithCloseButton
                        title={this.props.translate('iOUCurrencySelection.selectCurrency')}
                        onCloseButtonPress={() => Navigation.goBack()}
                    />
                    <View style={[styles.flex1, styles.w100]}>
                        <View style={[styles.flex1]}>
                            <View style={[styles.ph5, styles.pv3]}>
                                <TextInput
                                    ref={el => this.textInput = el}
                                    value={this.state.searchValue}
                                    onChangeText={this.changeSearchValue}
                                    placeholder={this.props.translate('common.search')}
                                />
                            </View>
                            <View style={[styles.flex1]}>
                                <SectionList
                                    indicatorStyle="white"
                                    keyboardShouldPersistTaps="always"
                                    showsVerticalScrollIndicator={false}
                                    sections={this.getSections()}
                                    keyExtractor={option => option.currencyCode}
                                    stickySectionHeadersEnabled={false}
                                    renderItem={({item, key}) => (
                                        <OptionRow
                                            key={key}
                                            mode="compact"
                                            hoverStyle={styles.hoveredComponentBG}
                                            option={item}
                                            onSelectRow={() => this.toggleOption(item.currencyCode)}
                                            isSelected={
                                                item.currencyCode === this.state.toggledCurrencyCode
                                            }
                                            showSelectedState
                                            hideAdditionalOptionStates
                                        />
                                    )}
                                    renderSectionHeader={({section: {title}}) => (
                                        <View>
                                            {this.state.currencyData.length === 0 ? (
                                                <Text style={[styles.ph5, styles.textLabel, styles.colorMuted]}>
                                                    {this.props.translate('common.noResultsFound')}
                                                </Text>
                                            ) : (
                                                <Text style={[styles.p5, styles.textMicroBold, styles.colorHeading]}>
                                                    {title}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    <FixedFooter>
                        <Button
                            success
                            isDisabled={!this.props.iou.selectedCurrencyCode}
                            style={[styles.w100]}
                            text={this.props.translate('iou.confirm')}
                            onPress={this.confirmCurrencySelection}
                        />
                    </FixedFooter>
                </KeyboardAvoidingView>
            </ScreenWrapper>
        );
    }
}

IOUCurrencySelection.propTypes = propTypes;
IOUCurrencySelection.defaultProps = defaultProps;

export default compose(
    withLocalize,
    withOnyx({
        currencyList: {key: ONYXKEYS.CURRENCY_LIST},
        myPersonalDetails: {key: ONYXKEYS.MY_PERSONAL_DETAILS},
        iou: {key: ONYXKEYS.IOU},
    }),
    withNetwork(),
)(IOUCurrencySelection);

import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import EmptyStateAvatars from '../../../components/EmptyStateAvatars';
import ReportWelcomeText from '../../../components/ReportWelcomeText';
import styles from '../../../styles/styles';

const propTypes = {
    report: PropTypes.oneOfType([PropTypes.object]),
    isChatRoom: PropTypes.bool,
};
const defaultProps = {
    report: {},
    isChatRoom: false,
};

const ReportActionItemCreated = props => (
    <View style={[styles.chatContent, styles.chatContentCreated]}>
        <View style={[styles.justifyContentCenter, styles.alignItemsCenter, styles.flex1]}>
            <EmptyStateAvatars
                avatarImageURLs={props.report.icons}
                secondAvatarStyle={[styles.secondAvatarHovered]}
                isChatRoom={props.report.isChatRoom}
            />
            <ReportWelcomeText report={props.report} shouldIncludeParticipants={!props.isChatRoom} />
        </View>
    </View>
);

ReportActionItemCreated.defaultProps = defaultProps;
ReportActionItemCreated.propTypes = propTypes;

export default ReportActionItemCreated;

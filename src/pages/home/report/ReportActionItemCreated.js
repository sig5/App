import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import RoomHeaderAvatars from '../../../components/RoomHeaderAvatars';
import ReportWelcomeText from '../../../components/ReportWelcomeText';
import * as ReportUtils from '../../../libs/reportUtils';
import styles from '../../../styles/styles';

const propTypes = {
    report: PropTypes.oneOfType([PropTypes.object]),
};
const defaultProps = {
    report: {},
};

const ReportActionItemCreated = (props) => {
    const isChatRoom = ReportUtils.isChatRoom(props.report);

    return (
        <View style={[styles.chatContent, styles.chatContentCreated]}>
            <View style={[styles.justifyContentCenter, styles.alignItemsCenter, styles.flex1]}>
                <RoomHeaderAvatars
                    avatarImageURLs={props.report.icons}
                    secondAvatarStyle={[styles.secondAvatarHovered]}
                    isChatRoom={isChatRoom}
                />
                <ReportWelcomeText report={props.report} shouldIncludeParticipants={!isChatRoom} />
            </View>
        </View>
    );
};

ReportActionItemCreated.defaultProps = defaultProps;
ReportActionItemCreated.propTypes = propTypes;

export default ReportActionItemCreated;

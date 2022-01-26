import React from 'react';
import {View} from 'react-native-web';
import EmptyStateAvatars from '../../../components/EmptyStateAvatars';
import styles from '../../../styles/styles';

const ReportActionItemCreated = (props) => (
    <View style={[styles.chatContent, styles.chatContentCreated]}>
        <View style={[styles.justifyContentCenter, styles.alignItemsCenter, styles.flex1]}>
            <EmptyStateAvatars
                avatarImageURLs={props.report.icons}
                secondAvatarStyle={[styles.secondAvatarHovered]}
                isChatRoom={isChatRoom}
            />
            <ReportWelcomeText report={props.report} shouldIncludeParticipants={!props.isChatRoom} />
        </View>
    </View>
);

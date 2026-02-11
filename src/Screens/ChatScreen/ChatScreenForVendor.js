import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import _, { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { pick } from '@react-native-documents/picker';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import ReactModal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import ChatMedia from '../../Components/ChatMedia';
import CircularImages from '../../Components/CircularImages';
import Header from '../../Components/Header';
import ButtonImage from '../../Components/ImageComp';
import VideoPlayer from '../../Components/VideoPlayer';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { cameraImgVideoHandler } from '../../utils/commonFunction';
import { getImageUrl, showError } from '../../utils/helperFunctions';
import { androidCameraPermission } from '../../utils/permissions';
import socketServices from '../../utils/scoketService';
import { getColorSchema } from '../../utils/utils';



export default function ChatScreenForVendor({ route, navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  let actionSheet = useRef();

  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route.params.data;
  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const userData = useSelector((state) => state?.auth?.userData);
  const styles = stylesFun({ fontFamily, isDarkMode });

  let defaultImage =
    'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png';

  const [messages, setMessages] = useState([]);
  const [state, setState] = useState({
    showParticipant: false,
    isLoading: false,
    roomUsers: [],
    allRoomUsersAppartFromAgent: [],
    allAgentIds: [],
  });
  const {
    isLoading,
    roomUsers,
    showParticipant,
    allRoomUsersAppartFromAgent,
    allAgentIds,
  } = state;
  const [isVisible, setisVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState({});

  const updateState = (data) => setState((state) => ({ ...state, ...data }));


  const isFocused = useIsFocused();



  useFocusEffect(
    useCallback(() => {
      socketServices.on('new-message', (data) => {
        if (paramData?.room_id == data?.message?.roomData?.room_id) {
          isFocused
            ? setMessages(previousMessages => {
              const updatedMessages = previousMessages.filter(
                message => message.isLoading !== true,
              );
              return GiftedChat.append(
                updatedMessages,
                data.message.chatData,
              );
            })
            : null;
          isFocused ? fetchAllRoomUser() : null;
        }
      });
      return () => {
        socketServices.removeListener('new-message');
        socketServices.removeListener('save-message');
      };
    }, [navigation]),
  );

  useEffect(() => {
    if (isFocused) {
      updateState({ isLoading: true });
      fetchAllRoomUser();
      fetchAllMessages();
    }
  }, []);

  const fetchAllMessages = useCallback(async () => {
    try {
      const apiData = `/${paramData?._id}`;
      const res = await actions.getAllMessages(apiData, {});
      console.log('fetchAllMessages res', res);
      updateState({ isLoading: false });
      if (!!res && isFocused) {
        let filterArry = res.map((val, i) => {
          return { ...val, user: {} };
        });
        setMessages(filterArry.reverse());
      }
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error);
      updateState({ isLoading: false });
    }
  }, []);

  const fetchAllRoomUser = useCallback(async () => {
    try {
      const apiData = `/${paramData?._id}`;
      const res = await actions.getAllRoomUser(
        apiData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      );
      console.log('fetchAllRoomUser res', res);
      if (!!res?.userData && isFocused) {
        let cloneRes = _.cloneDeep(res);
        let cloneRes2 = _.cloneDeep(res);

        console.log('cloneRescloneRes', res);

        const allRoomUsersAppartFromAgentAry = cloneRes?.userData.filter(
          (item) => {
            console.log('Item+++++++', item);
            if (item?.user_type == 'agent') {
              return item?.user_type !== 'agent';
            }
          },
        );
        const allAgentIdsAry = cloneRes2?.userData.filter((item) => {
          console.log('Item+++++++', item);
          if (item?.user_type == 'agent') {
            return item?.user_type == 'agent';
          }
        });

        updateState({
          allRoomUsersAppartFromAgent: allRoomUsersAppartFromAgentAry,
          allAgentIds: allAgentIdsAry,
          roomUsers: res?.userData,
        });
      }
    } catch (error) {
      console.log('error raised in fetchAllRoomUser api', error);
    }
  }, [allRoomUsersAppartFromAgent, allAgentIds]);


  // this funtion use for camera handle
  const cameraHandle = async (index = 0) => {
    if (index === 2) { // to open device's document gallary
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        if (
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          try {
            const res = await pick({
              type: [
                'application/pdf',
                'application/doc',
                'application/docx',
                'application/ppt',
              ],
            });

            if (!!res) {
              let fileObj = {
                path: res[0]?.uri,
                mime: 'docs',
                name: res[0]?.name,
              };
              uploadMedia(fileObj, (name = res[0]?.name));
              appendMediaPreview(fileObj);
            }
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
        } else {
          // Permission denied, handle accordingly
        }
      } catch (err) {
        console.warn(err);
      }
    }

    const permissionStatus = await androidCameraPermission();

    if (permissionStatus) { // to open device's image / video gallary
      cameraImgVideoHandler(index, {
        mediaType: 'any',
      })
        .then(async res => {
          if (!!res?.path) {
            console.log(res, '<====cameraImgVideoHandler');
            var thumbnailPath = {};
            if (res?.mime == 'video/mp4') {
              // thumbnailPath = await createThumbnail({
              //   url: res?.path,
              //   timeStamp: 10000, // Specify the timestamp for the desired thumbnail (in milliseconds)
              // });
              // setThumbnail(thumbnailPath);
            }

            // return;
            appendMediaPreview(res, thumbnailPath);
            uploadMedia(res, res.path.split('/').pop()); // upload media directly from gallary
          }
        })
        .catch(err => { });
    }
  };

  const appendMediaPreview = (media, thumbnail = '') => { // to set preview/thumbnail of image/video/document while uploading video
    let allMessages = cloneDeep(messages);
    let newMsg = {
      ...allMessages[0], // Copy properties from the first item
      mediaType: media?.mime,
      is_media: true,
      mediaUrl: media?.path,
      _id: allMessages[0]?._id + uuidv4(),
      isLoading: true,
      auth_user_id: userData?.id,
      name: media?.name,
    };

    if (media?.mime == 'video/mp4') {
      newMsg.thumbnailUrl = thumbnail;
    }
    allMessages.unshift(newMsg);
    setMessages(allMessages);
  };

  const uploadMedia = (fileRes = [], fileName = '') => { // To upload media filed to S3 server
    console.log(fileRes, '<====fileRes');
    if (!isEmpty(fileRes)) {
      let encodedData = encodeURIComponent(
        `uploads/${userData?.id}/${paramData?._id}/${fileName}`,
      ); //encoded media data for AWS-S3
      console.log(encodedData, '<====encodedData');

      actions
        .uploadMediaS3(
          encodedData,
          {},
          {
            // API to get presigned URL from S3
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then(async res => {
          console.log(res, '<===uploadMediaS3');
          const response = await fetch(fileRes.path);
          const blob = await response.blob(); // converts media to blob
          console.log(blob, '<===blob');
          fetch(res?.url, {
            // API to upload presigned URL to AWS directly
            method: 'PUT',
            body: blob,
          })
            .then(data => {
              console.log(data, '<===afterputS3');
              const hostname = data?.url.match(/^(https?:\/\/)([^:/\n]+)/)[0];
              let mediaUrl = hostname + `/${encodedData}`;

              onSend([
                {
                  mediaUrl: mediaUrl,
                  type: fileRes?.mime || fileRes?.type,
                  isMedia: true,
                },
              ]); // to send media info in user chat
            })
            .catch(err => {
              showError('Something went wrong');
            });
        })
        .catch(err => {
          showError('Something went wrong');
        });
    }
  };

  const onPressMedia = currentMessage => {
    if (
      currentMessage?.mediaType == 'application/pdf' ||
      currentMessage?.mediaType == 'docs'
    ) {
      Linking.openURL(currentMessage?.mediaUrl);
      return;
    }

    setisVisible(true);
    setCurrentMsg(currentMessage);
  };

  const onSend = useCallback(
    async (messages = []) => {
      if (
        String(messages[0].text).trim().length < 1 ||
        messages[0]?.mediaUrl == ''
      ) {
        return;
      }
      let phoneNumber = !!userData.phone_number
        ? `+${userData?.dial_code} ${userData.phone_number}`
        : null;
      console.log('phoneNumberphoneNumber', userData);
      let userImage = !!userData?.source
        ? getImageUrl(
          userData?.source?.proxy_url,
          userData?.source?.image_path,
          '200/200',
        )
        : null;
      try {
        let apiData = {
          room_id: paramData?._id,
          message: messages[0].text,
          user_type: 'vendor',
          to_message: 'to_user',
          from_message: 'from_vendor',
          user_id: userData?.id,
          email: userData.email,
          username: userData?.name,
          phone_num: phoneNumber,
          display_image: userImage,
          sub_domain: '192.168.101.88', //this is static value
          //'room_name' =>$data->name,
          chat_type: paramData?.type,
        };

        if (!!messages[0]?.isMedia) {
          apiData = {
            ...apiData,
            is_media: true,
            mediaUrl: messages[0]?.mediaUrl,
            thumbnailUrl: messages[0]?.mediaUrl,
            mediaType: messages[0]?.type,
          };
        }

        console.log('apiDataapiData', apiData);
        const res = await actions.sendMessage(apiData, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        });
        console.log('on send message res', res);
        socketServices.emit('save-message', res);
        await sendToUserNotification(paramData?._id, messages[0].text);
      } catch (error) {
        console.log('error raised in fetchAllMessages api', error);
      }
    },
    [allRoomUsersAppartFromAgent, allAgentIds],
  );

  const sendToUserNotification = async (id, text) => {
    let apiData = {
      user_ids:
        allRoomUsersAppartFromAgent.length == 0
          ? [{ auth_user_id: paramData?.vendor_id }]
          : allRoomUsersAppartFromAgent,
      roomId: id,
      roomIdText: paramData?.room_id,
      text_message: text,
      chat_type: paramData?.type,
      order_id: paramData?.order_id,
      all_agentids:
        allAgentIds.length == 0
          ? [{ auth_user_id: !!paramData?.agent_id ? paramData?.agent_id : '' }]
          : allAgentIds,
      order_vendor_id: paramData?.order_vendor_id,
      username: userData?.name,
      vendor_id: paramData?.vendor_id,
      auth_id: userData?.id,
      web: false,
    };
    console.log('sending api data', apiData);
    try {
      const res = await actions.sendNotification(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });
      console.log('res sendNotification', res);
    } catch (error) {
      console.log('error raised in sendToUserNotification api', error);
    }
  };
  const showRoomUser = useCallback(
    (props) => {
      if (_.isEmpty(roomUsers)) {
        return null;
      }
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => updateState({ showParticipant: true })}>
          <CircularImages
            size={28}
            isDarkMode={isDarkMode}
            fontFamily={fontFamily}
            data={roomUsers}
          />
        </TouchableOpacity>
      );
    },
    [roomUsers],
  );

  console.log('roomUsersroomUsers', roomUsers);

  const renderMessage = useCallback((props) => {
    const { currentMessage } = props;
    let isRight = currentMessage?.auth_user_id == userData?.id;

    if (isRight) {
      return !!currentMessage?.is_media ? (
        <ChatMedia
          currentMessage={currentMessage}
          isRight
          onPressMedia={() => onPressMedia(currentMessage)}
          containerStyle={{
            borderTopLeftRadius: moderateScale(12),
          }}
        />
      ) : <View
        key={String(currentMessage._id)}
        style={{
          ...styles.chatStyle,
          alignSelf: 'flex-end',
          backgroundColor: isDarkMode ? '#005246' : '#e2ffd3',
          borderBottomRightRadius: 0,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginHorizontal: 8, flexShrink: 1 }}>
            {currentMessage?.username || currentMessage?.phone_num ? (
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  textTransform: 'capitalize',
                  color: isDarkMode ? colors.white : colors.black,
                }}>
                {currentMessage?.username || currentMessage?.phone_num}{' '}
                {`(${currentMessage.user_type})`}
              </Text>
            ) : null}

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  ...styles.descText,
                  color: isDarkMode ? colors.white : colors.black,
                  marginTop: 0,
                }}>
                {currentMessage?.message}
              </Text>
              <Text
                style={{
                  ...styles.timeText,
                  color: isDarkMode ? '#84acaa' : colors.blackOpacity40,
                }}>
                {moment(currentMessage?.created_date).format('LT')}
              </Text>
            </View>
          </View>
        </View>

      </View>

    }
    return (
      <View>
        {!!currentMessage?.is_media ?
          <ChatMedia
            currentMessage={currentMessage}
            onPressMedia={() => {
              setCurrentMsg(currentMessage);
              setisVisible(true);
            }}
            containerStyle={{
              borderTopRightRadius: moderateScale(12),
            }}
          />
          :
          <View style={{ flexDirection: 'row' }}>
            <FastImage
              source={{
                uri: currentMessage?.display_image,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={styles.cahtUserImage}
            />
            <View
              key={String(currentMessage?._id)}
              style={{
                ...styles.chatStyle,
                alignSelf: 'flex-start',
                backgroundColor: isDarkMode ? '#363638' : '#ffffff',
                borderBottomLeftRadius: moderateScale(0),
                maxWidth: width / 1.2,
              }}>
              <View style={{ marginHorizontal: 8, flexShrink: 1 }}>
                {currentMessage?.username || currentMessage?.phone_num ? (
                  <Text
                    style={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.medium,
                      textTransform: 'capitalize',
                      color: isDarkMode ? colors.white : colors.black,
                    }}>
                    {currentMessage?.username || currentMessage?.phone_num}
                  </Text>
                ) : null}

                <Text
                  style={{
                    ...styles.descText,
                    color: isDarkMode ? colors.white : colors.black,
                  }}>
                  {currentMessage?.message}
                </Text>
                <Text
                  style={{
                    ...styles.timeText,
                    color: isDarkMode ? '#a4a3aa' : colors.blackOpacity43,
                  }}>
                  {moment(currentMessage?.created_date).format('LT')}
                </Text>
              </View>
            </View>
          </View>}
      </View>
    );
  }, []);

  const SendButton = useCallback(() => {
    return (
      <View
        style={{
          marginHorizontal: 10,
          alignSelf: 'center',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image source={imagePath.send} />
      </View>
    );
  }, []);
  const renderSend = (props) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ButtonImage //Send attachements button
          onPress={() => actionSheet.current.show()}
          image={imagePath.icAttachments}
          btnStyle={{
            marginLeft: 10,
          }}
          imgStyle={{
            height: moderateScale(25),
            width: moderateScale(25),
          }}
        />
        <Send
          alwaysShowSend
          containerStyle={{ backgroundColor: 'red' }}
          children={<SendButton />}
          {...props}
        />
      </View>
    );
  };
  return (
    <WrapperContainer statusBarColor={isDarkMode ? '#171717' : '#f6f6f6'}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={`# ${paramData?.room_id || ''}`}
        customRight={showRoomUser}
        headerStyle={{ backgroundColor: isDarkMode ? '#171717' : '#f6f6f6' }}
      />
      <ImageBackground
        source={isDarkMode ? imagePath.icBgDark : imagePath.icBgLight}
        style={{ flex: 1 }}>
        <GiftedChat
          // messagesContainerStyle={{ backgroundColor: isDarkMode?"#171717": "#f6f6f6"}}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{ _id: userData?.id }}
          renderMessage={renderMessage}
          isKeyboardInternallyHandled={true}
          extraData={messages}
          renderInputToolbar={(props) => {
            return (
              <InputToolbar
                containerStyle={{
                  backgroundColor: isDarkMode ? '#171717' : '#f6f6f6',
                  paddingTop: 0,
                }}
                {...props}
              />
            );
          }}
          textInputStyle={styles.textInputStyle}
          renderSend={renderSend}
        />
      </ImageBackground>

      <ReactModal
        isVisible={showParticipant}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({ showParticipant: false })}>
        <View
          style={{
            ...styles.modalStyle,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
          }}>
          <View style={styles.flexView}>
            <Text
              style={{
                fontFamily: fontFamily?.bold,
                fontSize: textScale(16),
                color: isDarkMode ? colors.white : colors.black,
              }}>
              {roomUsers.length} {strings.PARTICIPANTS}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => updateState({ showParticipant: false })}>
              <Image
                style={{ tintColor: isDarkMode ? colors.white : colors.black }}
                source={imagePath.closeButton}
              />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {roomUsers.map((val, i) => {
              return (
                <View
                  key={String(i)}
                  style={{
                    marginVertical: moderateScaleVertical(8),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <FastImage
                    source={{
                      uri: !!val?.display_image
                        ? val?.display_image
                        : defaultImage,
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    style={{
                      ...styles.imgStyle,
                      backgroundColor: isDarkMode
                        ? colors.whiteOpacity22
                        : colors.blackOpacity30,
                    }}
                  />
                  <View style={{ marginLeft: moderateScale(8) }}>
                    <Text
                      style={{
                        fontSize: textScale(12),
                        fontFamily: fontFamily.medium,
                        textTransform: 'capitalize',
                        color: isDarkMode ? colors.white : colors.black,
                      }}>
                      {val?.auth_user_id == userData?.id
                        ? 'You'
                        : val?.username}{' '}
                      {`(${val?.user_type})`}
                    </Text>
                    {!!val?.phone_num ? (
                      <Text
                        style={{
                          fontSize: textScale(12),
                          fontFamily: fontFamily.medium,
                          textTransform: 'capitalize',
                          color: isDarkMode ? colors.white : colors.black,
                        }}>
                        {val?.phone_num || val?.email}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ReactModal>
      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[
          strings.CAMERA,
          strings.GALLERY,
          strings.DOCUMENTS,
          strings.CANCEL,
        ]}
        cancelButtonIndex={3}
        destructiveButtonIndex={3}
        onPress={index => cameraHandle(index)}
      />
      <Modal
        style={{}}
        animationType="slide"
        transparent={false}
        visible={isVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.black,
          }}>
          <View
            style={{
              margin: moderateScale(20),
            }}>
            <ButtonImage
              onPress={() => setisVisible(false)}
              image={imagePath.backArrow}
              imgStyle={{
                tintColor: colors.white,
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
            }}>
            {currentMsg?.mediaType === 'application/pdf' ||
              currentMsg?.mediaType === 'docs' ? (
              <></>
            ) : currentMsg?.mediaType === 'video/mp4' ? (
              <VideoPlayer
                pause={false}
                source={{
                  uri: currentMsg?.mediaUrl,
                }}
                containerStyle={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            ) : (
              <FastImage
                source={{ uri: currentMsg?.mediaUrl }}
                style={{
                  flex: 1,
                }}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}

const stylesFun = ({ fontFamily, isDarkMode }) => {
  const styles = StyleSheet.create({
    imgStyle: {
      width: moderateScale(35),
      height: moderateScale(35),
      borderRadius: moderateScale(35 / 2),
    },
    modalStyle: {
      padding: moderateScale(10),
      borderTopLeftRadius: moderateScale(8),
      borderTopRightRadius: moderateScale(8),
      maxHeight: height / 2,
    },
    userNameStyle: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      textTransform: 'capitalize',
    },
    cahtUserImage: {
      width: moderateScale(20),
      height: moderateScale(20),
      borderRadius: moderateScale(10),
      backgroundColor: isDarkMode
        ? colors.whiteOpacity22
        : colors.blackOpacity30,
      marginLeft: 8,
    },
    descText: {
      fontSize: textScale(11),
      fontFamily: fontFamily.regular,
      // textTransform: 'capitalize',
      lineHeight: moderateScale(18),
      marginTop: moderateScaleVertical(4),
    },
    timeText: {
      fontSize: textScale(10),
      fontFamily: fontFamily.regular,
      textTransform: 'uppercase',
      color: colors.blackOpacity43,
      marginLeft: moderateScale(12),
      marginTop: moderateScaleVertical(6),
      alignSelf: 'flex-end',
    },
    flexView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chatStyle: {
      paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(10),
      paddingHorizontal: moderateScale(2),
      maxWidth: width - 16,
      marginHorizontal: moderateScale(8),
    },
    textInputStyle: {
      backgroundColor: isDarkMode ? '#2c2c2e' : '#ffffff',
      paddingTop: Platform.OS == 'ios' ? 10 : undefined,
      borderRadius: moderateScale(20),
      paddingHorizontal: moderateScale(20),
      textAlignVertical: 'center',
      fontFamily: fontFamily.regular,
      alignSelf: 'center',
      color: isDarkMode ? colors.white : colors.black,
      marginTop: moderateScaleVertical(6),
    },
  });
  return styles;
};

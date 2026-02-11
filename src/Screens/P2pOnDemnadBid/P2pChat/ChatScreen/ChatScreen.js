import Voice from '@react-native-voice/voice';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import _, { cloneDeep, isArray, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import ChatMedia from '../../../../Components/ChatMedia';
import CircularImages from '../../../../Components/CircularImages';
import ButtonImage from '../../../../Components/ImageComp';
import VideoPlayer from '../../../../Components/VideoPlayer';
import WrapperContainer from '../../../../Components/WrapperContainer';
import imagePath from '../../../../constants/imagePath';
import strings from '../../../../constants/lang';
import navigationStrings from '../../../../navigation/navigationStrings';
import actions from '../../../../redux/actions';
import colors from '../../../../styles/colors';
import {
  StatusBarHeight,
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../../styles/theme';
import { cameraImgVideoHandler } from '../../../../utils/commonFunction';
import { getImageUrl, showError, showSuccess } from '../../../../utils/helperFunctions';
import { androidCameraPermission } from '../../../../utils/permissions';
import socketServices from '../../../../utils/scoketService';
import { getColorSchema } from '../../../../utils/utils';



export default function ChatScreen({ route, navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  let actionSheet = useRef();
  const insets = useSafeAreaInsets()

  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route.params.data;
  console.log(paramData, "fsadlkfjasldjf")
  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const { userData } = useSelector((state) => state?.auth);
  const { dineInType } = useSelector((state) => state?.home);
  const isChatRefresh = useSelector(
    (state) => state?.chatRefresh.isChatRefresh,
  );
  const styles = stylesFun({ fontFamily, isDarkMode });

  let defaultImage =
    'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png';

  const [messages, setMessages] = useState([]);
  const [state, setState] = useState({
    showParticipant: false,
    isLoading: false,
    roomUsers: [],
    isVoiceRecord: false,
    allRoomUsersAppartFromAgent: [],
    allAgentIds: [],
    productDetails: [],
    reciverData: [],
    borrower_data: []
  });
  const {
    isLoading,
    roomUsers,
    isVoiceRecord,
    showParticipant,
    chatUsersData,
    allRoomUsersAppartFromAgent,
    allAgentIds,
    productDetails,
    reciverData,
    borrower_data
  } = state;
  const [orderVendorDetail, setOrderVendorDetail] = useState({})

  const [isVisible, setisVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState({});

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      if (dineInType == 'p2p') {
        getProductDetail();
      }

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

      socketServices.on('room-created', (data) => {
        fetchAllRoomUser();
      });
      return () => {
        socketServices.removeListener('new-message');
        socketServices.removeListener('save-message');
      };
    }, [navigation]),
  );


  const getOrderNumber = (item) => {
    console.log(item, 'yeryeu')
    // Split the string by hyphens ("-")
    const parts = item?.room_id.split('-');

    // Get the last element of the resulting array
    const valueAfterLastHyphen = parts[parts.length - 1];
    console.log(valueAfterLastHyphen, 'valueAfterLastHyphenvalueAfterLastHyphen')
    return !!valueAfterLastHyphen ? valueAfterLastHyphen : false
  }

  const getProductDetail = () => {
    const data = getOrderNumber(paramData)
    console.log(data, 'datadata')
    actions
      .getProuctDetailsRelatedToChat(
        {
          product_id: paramData?.product_id,
          order_vendor_id: paramData?.vendor_id_order || paramData?.vendor_id,
          order_id: data
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'productDetailsproductDetailsproductDetails')
        setOrderVendorDetail(res?.order_vendor)
        updateState({
          productDetails: res?.orderData,
          reciverData: res?.vendorData
        });
      })
      .catch((err) => {
        console.log(err, 'err....err');
      });
  };

  useFocusEffect(
    useCallback(() => {
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []),
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

  async function fetchAllRoomUser() {
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
      let reciver_data_room = res?.userData.filter((item, inx) => {
        console.log(item, 'fetchAllRoomUser')
        if (item?.user_id != userData?.id) {
          return item
        }
      })
      if (!!res?.userData && isFocused) {
        let cloneRes = _.cloneDeep(res);
        let cloneRes2 = _.cloneDeep(res);


        const allRoomUsersAppartFromAgentAry = cloneRes?.userData.filter(
          (item) => {

            if (item?.user_id != userData?.id) {
              return item?.user_type !== 'agent';
            }
          },
        );
        const allAgentIdsAry = cloneRes2?.userData.filter((item) => {

          if (item?.user_type == 'agent') {
            return item?.user_type == 'agent';
          }
        });

        console.log(reciver_data_room, 'datadata')
        updateState({
          allRoomUsersAppartFromAgent: allRoomUsersAppartFromAgentAry,
          allAgentIds: allAgentIdsAry,
          roomUsers: res?.userData,
          borrower_data: reciver_data_room
        });
      }
    } catch (error) {
      console.log('error raised in fetchAllRoomUser api', error);
    }
  }

  const checkToMessage = () => {
    let userType = paramData?.type;
    if (!!userData?.is_superadmin && userType == 'agent_to_user') {
      return 'to_user_agent';
    }
    if (!!userData?.is_superadmin && userType == 'vendor_to_user') {
      return 'to_user_vendor';
    }
    if (userType == 'agent_to_user') {
      return 'to_agent';
    }
    if (userType == 'vendor_to_user') {
      return 'to_vendor';
    }
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
          user_type: !!userData?.is_superadmin ? 'admin' : 'user',
          to_message: checkToMessage(),
          from_message: !!userData?.is_superadmin ? 'from_admin' : 'from_user',
          user_id: userData?.id,
          email: userData?.email,
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

        console.log(apiData, '<====data sending sendMessage');
        const res = await actions.sendMessage(apiData, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        });
        console.log('on send message res', res);

        socketServices.emit('save-message', res);
        // const message = {
        //   _id: userData.id,
        //   auth_user_id: userData.id,
        //   message: messages[0].text,
        //   createdAt: new Date(),
        //   username: userData?.name,
        //   display_image: getImageUrl(
        //     userData?.source?.proxy_url,
        //     userData?.source?.image_path,
        //     '200/200',
        //   )
        // };
        await sendToUserNotification(paramData?._id, messages[0].text);
        // setMessages(previousMessages => GiftedChat.append(previousMessages, message))
      } catch (error) {
        console.log('error raised in fetchAllMessages api', error);
      }
    },
    [allRoomUsersAppartFromAgent, allAgentIds],
  );


  const sendToUserNotification = (id, text) => {
    let notificaionAgentIds =
      allAgentIds.length == 0
        ? [{ auth_user_id: !!paramData?.agent_id ? paramData?.agent_id : '' }]
        : allAgentIds;

    let apiData = {
      user_ids:
        allRoomUsersAppartFromAgent.length == 0
          ? [{ auth_user_id: reciverData?.id }]
          : allRoomUsersAppartFromAgent,
      roomId: id,
      roomIdText: paramData?.room_id,
      text_message: text,
      chat_type: paramData?.type,
      order_id: paramData?.order_id,
      all_agentids: notificaionAgentIds,
      // all_agentids:
      //   allAgentIds.length == 0
      //     ? [{auth_user_id: !!paramData?.agent_id ? paramData?.agent_id : ''}]
      //     : (allAgentIds.length > 1 && paramData?.type == "agent_to_user") ,
      order_vendor_id: paramData?.order_vendor_id,
      username: userData?.name,
      vendor_id: paramData?.vendor_id,
      auth_id: userData?.id,
      web: false,
    };
    console.log(apiData, "<<<<apiData")
    actions
      .sendNotification(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'response+++++', apiData);
      })
      .catch((error) => {
        console.log(error, 'errororr in notification');
      });
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

  const renderMessage = useCallback(props => {
    const { currentMessage } = props;
    let isRight = currentMessage?.auth_user_id == userData?.id;

    if (isRight) {
      return !!currentMessage?.is_media ? (
        <ChatMedia
          currentMessage={currentMessage}
          isRight
          onPressMedia={() => onPressMedia(currentMessage)}
        />
      ) : (
        <View
          key={String(currentMessage._id)}
          style={{
            ...styles.chatStyle,
            alignSelf: 'flex-end',
            backgroundColor: isDarkMode ? '#005246' : themeColors?.primary_color,
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
                    color: colors.white,
                  }}>
                  {currentMessage?.username || currentMessage?.phone_num}{' '}
                  {dineInType !== 'p2p' && `(${currentMessage?.user_type})`}
                </Text>
              ) : null}

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text
                  style={{
                    ...styles.descText,
                    color: colors.white,
                    marginTop: 0,
                  }}>
                  {currentMessage?.message}
                </Text>
                <Text
                  style={{
                    ...styles.timeText,
                    color: colors.whiteOpacity77,
                  }}>
                  {moment(currentMessage?.created_date).format('LT')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View>
        {!!currentMessage?.is_media ? (
          <ChatMedia
            currentMessage={currentMessage}
            onPressMedia={() => {
              setCurrentMsg(currentMessage);
              setisVisible(true);
            }}
          />
        ) : (
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
                backgroundColor: isDarkMode ? '#363638' : colors.whiteSmokeColor,
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
                    {currentMessage?.username || currentMessage?.phone_num}{' '}
                    {dineInType !== 'p2p' && `(${currentMessage?.user_type})`}
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
          </View>
        )}
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

  const onSpeechStartHandler = (e) => { };
  const onSpeechEndHandler = (e) => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = (e) => {
    let text = e.value[0];
    onSend([{ text: text }]);
    _onVoiceStop();
  };

  const _onVoiceListen = async () => {
    const langType = languages?.primary_language?.sort_code;
    updateState({ isVoiceRecord: true });
    try {
      await Voice.start(langType);
    } catch (error) { }
  };

  const _onVoiceStop = async () => {
    updateState({
      isVoiceRecord: false,
    });
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error raised', error);
    }
  };


  // this funtion use for camera handle 
  const cameraHandle = async (index = 0) => {
    if (index === 2) { // to open device's document gallary
      try {
        // Check if the platform is Android
        if (Platform.OS === 'android') {
          // Request external storage permissions for Android
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]);

          // Check if both permissions are granted
          if (
            granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
          ) {
            // Proceed with document picker for Android
            pickDocument();
          } else {
            // Handle permission denied for Android
          }
        } else {
          // For iOS, proceed directly with the document picker
          pickDocument();
        }
      } catch (err) {
        console.warn(err);
      }
    }

    else {
      const permissionStatus = await androidCameraPermission();
      if (permissionStatus) { // to open device's image / video gallary
        cameraImgVideoHandler(index, {
          mediaType: 'any',
          multiple: true
        })
          .then(async res => {
            if ((index == 0 && !isEmpty(res) && res?.path) || (index == 1 && isArray(res))) {
              appendMediaPreview(isArray(res) ? res : [res], true);
              uploadMedia(isArray(res) ? res : [res], true)
            }
          })
          .catch(err => { });
      }

    }
  };

  const pickDocument = async () => {
    try {
      const res = await pickMultiple({
        type: [
          'application/pdf',
          'application/doc',
          'application/docx',
          'application/ppt',
        ],
      });

      console.log(res, "fasdkfhkasldf")
      if (!!res) {

        uploadMedia(res, false);
        appendMediaPreview(res, false);
        // let fileObj = {
        //   path: res[0]?.uri,
        //   mime: 'docs',
        //   name: res[0]?.name,
        // };

      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };


  const appendMediaPreview = (files, isImg = false) => {
    // to set preview/thumbnail of image/video/document while uploading video
    let allMessages = cloneDeep(messages);

    files.map(async (media, inx) => {
      var thumbnailPath = {};
      if (media?.mime == 'video/mp4') {
        // thumbnailPath = await createThumbnail({
        //   url: media?.path,
        //   timeStamp: 10000, // Specify the timestamp for the desired thumbnail (in milliseconds)
        // });
        // setThumbnail(thumbnailPath);
      }
      let newMsg = {
        ...allMessages[0], // Copy properties from the first item
        mediaType: isImg ? media?.mime : "docs",
        is_media: true,
        mediaUrl: isImg ? media?.path : media?.uri,
        _id: allMessages[0]?._id + uuidv4(),
        isLoading: true,
        auth_user_id: userData?.id,
        name: media?.name,
      };
      if (media?.mime == 'video/mp4') {
        newMsg.thumbnailUrl = thumbnailPath;
      }
      allMessages.unshift(newMsg);
    })

    setMessages(allMessages);



  };


  const uploadMedia = (fileRes = [], isImg = false) => { // To upload media filed to S3 server

    const requestPromises = fileRes.map((resp) => {

      let encodedData = encodeURIComponent(
        `uploads/${userData?.id}/${paramData?._id}/${isImg ? resp?.path.split('/').pop() : resp?.uri.split('/').pop()}`,
      ); //encoded media data for AWS-S3
      console.log(encodedData, '<====encodedData');

      return actions
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
    });



    axios.all(requestPromises)
      .then(axios.spread(async (...responses) => {
        for (let i = 0; i < responses.length; i++) {
          const res = responses[i];
          const blobResp = await fetch(isImg ? fileRes[i]?.path : fileRes[i]?.uri);
          const blob = await blobResp.blob(); // converts media to blob

          var encodedData = encodeURIComponent(
            `uploads/${userData?.id}/${paramData?._id}/${isImg ? fileRes[i]?.path?.split('/').pop() : fileRes[i]?.uri?.split('/').pop()}`,
          ); //encoded media data for AWS-S3
          try {

            let data = await fetch(res?.url, {
              // API to upload presigned URL to AWS directly
              method: 'PUT',
              body: blob,
            })

            if (!!data) {
              console.log(data, '<===afterputS3');
              const hostname = data?.url.match(/^(https?:\/\/)([^:/\n]+)/)[0];
              let mediaUrl = hostname + `/${encodedData}`;
              onSend([
                {
                  mediaUrl: mediaUrl,
                  type: isImg ? fileRes[i]?.mime || fileRes[i]?.type : "docs",
                  isMedia: true,
                },
              ]); // to send media info in user chat
            }
          } catch (error) {

          }


        }
        // responses.forEach(async (res) => {
        //   console.log(res, "asdfkajsdhkf")

        // fileRes?.map(async (item) => {
        //   console.log(item, "item>>>>>item")
        //   const blobResp = await fetch(item.path);
        //   const blob = await blobResp.blob(); // converts media to blob
        //   console.log(blob, '<===blob');
        //   fetch(res?.url, {
        //     // API to upload presigned URL to AWS directly
        //     method: 'PUT',
        //     body: blob,
        //   })
        //     .then(data => {
        //       console.log(data, '<===afterputS3');
        //       const hostname = data?.url.match(/^(https?:\/\/)([^:/\n]+)/)[0];
        //       let mediaUrl = hostname + `/${encodedData}`;

        //       onSend([
        //         {
        //           mediaUrl: mediaUrl,
        //           type: fileRes?.mime || fileRes?.type,
        //           isMedia: true,
        //         },
        //       ]); // to send media info in user chat
        //     })
        //     .catch(err => {
        //       showError('Something went wrong');
        //     });

        // })
        // const response = await fetch(fileRes.path);
        // const blob = await response.blob(); // converts media to blob
        // console.log(blob, '<===blob');
        // fetch(res?.url, {
        //   // API to upload presigned URL to AWS directly
        //   method: 'PUT',
        //   body: blob,
        // })
        //   .then(data => {
        //     console.log(data, '<===afterputS3');
        //     const hostname = data?.url.match(/^(https?:\/\/)([^:/\n]+)/)[0];
        //     let mediaUrl = hostname + `/${encodedData}`;

        //     onSend([
        //       {
        //         mediaUrl: mediaUrl,
        //         type: fileRes?.mime || fileRes?.type,
        //         isMedia: true,
        //       },
        //     ]); // to send media info in user chat
        //   })
        //   .catch(err => {
        //     showError('Something went wrong');
        //   });

        // });
      }))
      .catch(error => {
        console.error('Error:', error);
      });

    return
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

  const openGoogleMap = () => {
    var url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${productDetails?.latitude},${productDetails?.longitude}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const onPickupDropoffComplete = () => {

    Alert.alert('', `Are you sure you want to complete the ${(orderVendorDetail?.order_status_option_id == 1 || orderVendorDetail?.order_status_option_id == 2) ? "pickup" : "drop"} for the ${productDetails?.title}`, [
      {
        text: strings.NO,
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: strings.YES, onPress: () => {

          actions.pickUpDropoffComplete({
            order_vendor_id: orderVendorDetail?.id,
            order_status_option_id: (orderVendorDetail?.order_status_option_id == 1 || orderVendorDetail?.order_status_option_id == 2) ? 4 : 6
          }, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          }).then((res) => {
            showSuccess("Order status updated")
            navigation.goBack()
          }).catch((err => {
            showError(err?.message);
          }))
        }
      },
    ]);
  }

  let apiHeaders = {
    code: appData?.profile?.code,
    currency: currencies?.primary_currency?.id,
    language: languages?.primary_language?.id,
  }
  const onRaiseIssue = () => {
    console.log(!!paramData?.isRaiseIssue, '!!paramData?.isRaiseIssue')
    if (!!paramData?.isRaiseIssue) {
      Alert.alert('', `Are you sure you want to resolve an issue`, [
        {
          text: strings.NO,
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: strings.YES, onPress: () => {
            actions.raiseAnIssueInChat(`/${paramData?._id}`, {
              isRaiseIssue: 0
            }, apiHeaders).then((res) => {
              showSuccess("Request submitted successfully")
              actions.onSendAdminNotification({ user_id: userData?.id, order_number: getOrderNumber(paramData), vendor_id: productDetails?.vendor?.id }, apiHeaders).then((res) => {
              }).catch((err) => {
                console.log(err, "<<<err")
              })
            }).catch((err) => {
              showError('Something went wrong');
            })
            navigation.goBack()
          }
        },
      ]);

      return
    }
    Alert.alert('', `Are you sure you want to raise an issue?`, [
      {
        text: strings.NO,
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: strings.YES, onPress: () => {

          actions.raiseAnIssueInChat(`/${paramData?._id}`, {
            isRaiseIssue: 1
          }, apiHeaders).then((res) => {
            console.log(res, 'resresresresres');
            actions.raiseIssueMail(
              {
                user_id: userData?.id,
                order_number: getOrderNumber(paramData), vendor_id: productDetails?.vendor?.id
              }
              , apiHeaders).then((res) => {
                console.log(res, 'errorerrorerrorerror');
              }).catch((error) => {
                console.log(error, 'errorerrorerrorerror');

              })
            showSuccess("Request submitted successfully")
            actions.onSendAdminNotification({ user_id: userData?.id, order_number: getOrderNumber(paramData), vendor_id: productDetails?.vendor?.id }, apiHeaders).then((res) => {
              console.log(res, "fasdlkhfds")

            }).catch((err) => {
              console.log(err, "fasldkhlf")
            })
          }).catch((err) => {
            showError('Something went wrong');
          })
          navigation.goBack()
        }
      },
    ]);



  }

  const renderSend = props => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        {/* <TouchableOpacity 
        style={{ marginLeft: 8 }}
        activeOpacity={0.7}
        onPress={cameraHandle}
        >
          <Image
            source={imagePath.ic_cameraColored}
            resizeMode="contain"
            style={{
              height: moderateScale(20),
              width: moderateScale(20),
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>

        {isVoiceRecord ? (
          <TouchableOpacity
            onPress={_onVoiceStop}
          >
            <LottieView
              style={{
                height: moderateScale(43),
                width: moderateScale(30),
                marginLeft: moderateScale(-2),
              }}
              source={voiceListen}
              autoPlay
              loop
              colorFilters={[
                { keypath: 'layers', color: themeColors.primary_color },
                { keypath: 'transparent2', color: themeColors.primary_color },
                { keypath: 'transparent1', color: themeColors.primary_color },
                { keypath: '01', color: themeColors.primary_color },
                { keypath: '02', color: themeColors.primary_color },
                { keypath: '03', color: themeColors.primary_color },
                { keypath: '04', color: themeColors.primary_color },
              ]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ marginLeft: moderateScale(8) }}
            onPress={_onVoiceListen}
          >
            <Image
              source={imagePath.icVoice}
              style={{
                height: moderateScale(20),
                width: moderateScale(20),
                borderRadius: moderateScale(10),
                tintColor: themeColors.primary_color,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )} */}
        <ButtonImage
          onPress={() => actionSheet.current.show()}
          image={imagePath.icAttachments}
          btnStyle={{
            marginLeft: 10,
          }}
          imgStyle={{
            height: moderateScale(25),
            width: moderateScale(25),
            tintColor: isDarkMode ? colors.white : colors.black
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


  const getUniqueByProperty = (arr, property) => {
    return arr.reduce((unique, item) => {
      const hasProperty = unique.some((uniqueItem) => uniqueItem[property] === item[property]);
      if (!hasProperty) {
        unique.push(item);
      }
      return unique;
    }, []);
  }


  return (
    <WrapperContainer bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>


      <View style={{
        height: moderateScaleVertical(56),
        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: moderateScale(20),
        alignItems: "center"
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
          {console.log(reciverData, 'reciverDatareciverData')}
          <ButtonImage imgStyle={{ tintColor: isDarkMode ? colors.white : colors.black }} onPress={() => !!paramData?.isFromOrder ? navigation.reset({
            index: 0,
            routes: [{ name: navigationStrings.TAB_ROUTES }],
          }) : navigation.goBack()} image={imagePath.ic_backarrow} />
          {(!!reciverData?.image_fit || !!productDetails?.vendor?.user_vendor?.user?.image?.image_fit?.image) ? <FastImage style={{
            height: moderateScale(28),
            width: moderateScale(28),
            borderRadius: moderateScale(14),
            marginLeft: moderateScale(8)
          }} source={{
            uri: getImageUrl(userData?.vendor_id == productDetails?.vendor_id ? reciverData?.image?.image_fit : productDetails?.vendor?.user_vendor?.user?.image?.image_fit
              , userData?.vendor_id == productDetails?.vendor_id ? reciverData?.image?.image_path : productDetails?.vendor?.user_vendor?.user?.image?.image_path, "200/200"),
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}

          /> :
            !!reciverData?.name ? <View
              style={{
                width: moderateScale(30),
                height: moderateScale(30),
                marginLeft: moderateScale(6),
                borderRadius: moderateScale(30) / 2,
                backgroundColor: colors.paleRed,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: textScale(20),
                  fontFamily: fontFamily.medium,
                  color: colors.black,
                  textTransform: 'capitalize'
                }}>
                {reciverData.name.slice(0, 1)[0]}
              </Text>
            </View> :
              <></>
          }

          <Text numberOfLines={2} style={{
            marginLeft: moderateScale(8),
            fontFamily: fontFamily?.bold,
            fontSize: textScale(16),
            width: width / 2,
            color: isDarkMode ? colors.white : colors.black
          }}>
            {userData?.vendor_id != productDetails?.vendor?.id ? productDetails?.vendor?.name + getUniqueByProperty(borrower_data, "user_id").map((item, inx) => {
              if (item?.auth_user_id != userData?.id) {
                return `${', '}${item.username}`
              }
            }) || '' :
              (!isEmpty(borrower_data) && borrower_data.length >= 1) ? getUniqueByProperty(borrower_data, "user_id").map((item, inx) => {
                return `${inx !== 0 ? ', ' : ""}${item.username}`

              }) : isEmpty(roomUsers) ? productDetails?.vendor?.name : isEmpty(borrower_data) && roomUsers[0]?.username}</Text>


        </View>



        {((orderVendorDetail?.order_status_option_id == 1 || orderVendorDetail?.order_status_option_id == 2) && userData?.vendor_id === productDetails?.vendor_id) && <TouchableOpacity onPress={onPickupDropoffComplete}>
          <Text style={{
            fontFamily: fontFamily?.bold,
            color: themeColors?.primary_color,
            fontSize: textScale(10),
            maxWidth: width / 4
          }}>{"Pickup Complete"}</Text>
        </TouchableOpacity>}
        {(orderVendorDetail?.order_status_option_id == 4 && userData?.vendor_id === productDetails?.vendor_id) && <TouchableOpacity onPress={onPickupDropoffComplete}>
          <Text style={{
            fontFamily: fontFamily?.bold,
            color: themeColors?.primary_color,
            fontSize: textScale(10),
            maxWidth: width / 4
          }}>{"Drop-off Complete"}</Text>

        </TouchableOpacity>}

      </View>
      <View style={{
        flexDirection: "row",
        // height: moderateScaleVertical(76),
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.textGreyO,
        padding: moderateScale(16),
        alignItems: "center",
        justifyContent: "space-between",
      }}>


        <TouchableOpacity
          onPress={() => navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, { product_id: productDetails?.id, isMyPost: true })}
          activeOpacity={0.1}
          style={{
            flex: 1
          }}>
          <Text style={{
            fontFamily: fontFamily?.bold,
            fontSize: textScale(15),
            color: isDarkMode ? colors.white : colors.black

          }}>{productDetails?.title}</Text>


        </TouchableOpacity>
        {console.log(paramData?.isRaiseIssue, 'paramData?.isRaiseIssue paramData?.isRaiseIssue ')}
        {!paramData?.isRaiseIssue && <TouchableOpacity
          onPress={onRaiseIssue}
          activeOpacity={0.1}
          style={{
            flex: 0.3
          }}>
          <Text style={{
            fontFamily: fontFamily?.bold,
            fontSize: textScale(10),
            textAlign: "right",
            color: !!paramData?.isRaiseIssue ? colors.green : colors.redB
          }}>{"Raise an issue"}</Text>

        </TouchableOpacity>
        }
      </View>

      <GiftedChat
        messages={messages}
        bottomOffset={insets.bottom + 2}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userData?.id }}
        renderMessage={renderMessage}
        isKeyboardInternallyHandled={true}
        extraData={messages}
        placeholder={"Write here..."}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              containerStyle={{
                backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white,
                paddingTop: 0,
              }}
              {...props}
            />
          );
        }}
        textInputStyle={styles.textInputStyle}
        renderSend={renderSend}
      />

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
          strings.CANCEL,
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}

        onPress={index => cameraHandle(index)}
      />
      <Modal
        style={{
          zIndex: 1
        }}
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={() => {
          setisVisible(false)
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.black,
            paddingTop: Platform.OS == "ios" ? StatusBarHeight : 0
          }}>

          <ButtonImage
            onPress={() => setisVisible(false)}
            image={imagePath.backArrow}
            imgStyle={{
              tintColor: colors.white,
            }}
            btnStyle={{
              marginLeft: moderateScale(16)
            }}
          />


          <View
            style={{
              flex: 1,
            }}>
            {currentMsg?.mediaType === 'application/pdf' ? (
              <></>
            ) : currentMsg?.mediaType === 'video/mp4' ? (
              <VideoPlayer
                pause={false}
                isModalPlayer={true}
                source={{ uri: currentMsg?.mediaUrl }} containerStyle={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  alignItems: "center",
                  justifyContent: "center"
                }} />

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


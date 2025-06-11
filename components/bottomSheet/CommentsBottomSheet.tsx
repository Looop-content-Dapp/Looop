import { usePostComments } from "@/hooks/community/usePostComments";
import { usePostInteractions } from "@/hooks/community/usePostInteractions";
import { useAppSelector } from "@/redux/hooks";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  ArrowLeft01Icon,
  Comment02Icon,
  FavouriteIcon,
  SentIcon,
} from "@hugeicons/react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define comment type based on your data structure
interface User {
  _id: string;
  username: string;
  profileImage: string;
  isVerified?: boolean;
}

interface CommentType {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  replies: CommentType[];
  isEdited?: boolean;
}

interface CommentsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  commentsCount: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const CommentsBottomSheet: React.FC<CommentsBottomSheetProps> = ({
  isVisible,
  onClose,
  postId,
  commentsCount,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "60%"], []);
  const [currentPage, setCurrentPage] = useState<"comments" | "reply">(
    "comments"
  );
  const [replyToComment, setReplyToComment] = useState<any>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const { data, isLoading } = usePostComments(postId);
  const { commentOnPost, likePost, isCommenting } = usePostInteractions();
  const { userdata } = useAppSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Handle keyboard events
  useEffect(() => {
    const keyboardWillShowListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", (e) => {
            setIsKeyboardVisible(true);
            Animated.timing(keyboardHeight, {
              duration: e.duration,
              toValue: e.endCoordinates.height,
              useNativeDriver: false,
            }).start();
          })
        : Keyboard.addListener("keyboardDidShow", (e) => {
            setIsKeyboardVisible(true);
            keyboardHeight.setValue(e.endCoordinates.height);
          });

    const keyboardWillHideListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", (e) => {
            setIsKeyboardVisible(false);
            Animated.timing(keyboardHeight, {
              duration: e.duration,
              toValue: 0,
              useNativeDriver: false,
            }).start();
          })
        : Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyboardVisible(false);
            keyboardHeight.setValue(0);
          });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
        setCurrentPage("comments");
        setReplyToComment(null);
        setCommentText("");
        Keyboard.dismiss();
      }
    },
    [onClose]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  const handleSendComment = async () => {
    if (commentText.trim() && userdata) {
      await commentOnPost({
        userId: userdata._id,
        postId,
        content: commentText,
        replyTo: replyToComment?._id,
      });
      setCommentText("");
      if (currentPage === "reply") {
        setCurrentPage("comments");
        setReplyToComment(null);
      }
      Keyboard.dismiss();
    }
  };

  const handleReply = (comment: any) => {
    setReplyToComment(comment);
    setCurrentPage("reply");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleLike = (commentId: string) => {
    if (userdata) {
      likePost({
        userId: userdata._id,
        postId: commentId, // In this case, using commentId as the target for like
      });
    }
  };

  // Format timestamps to match the design (e.g., "23m ago")
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };

  // Render a single comment
  const renderComment = ({ item }: { item: CommentType }) => {
    return (
      <View className="mb-4 px-4">
        <View className="flex-row mb-1">
          <View className="mr-3">
            <Avatar
              source={{
                uri:
                  item.user.profileImage ||
                  "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
              }}
              size={38}
              rounded
              containerStyle={{ borderWidth: 1.5, borderColor: "#f4f4f4" }}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center mb-1 justify-between">
              <Text className="text-[16px] font-PlusJakartaSansBold text-[#FFFFFF] mr-1.5">
                {item.user.username}
              </Text>
              {item.user.isVerified && (
                <View className="bg-green-500 w-4 h-4 rounded-full justify-center items-center mr-1.5">
                  <Text className="text-gray-900 text-xs font-bold">✓</Text>
                </View>
              )}
              <Text className="text-[12px] text-[#63656B] font-PlusJakartaSansMedium">
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
            <Text className="text-[14px] text-[#FFFFFF] font-PlusJakartaSansRegular mb-2 leading-5">
              {item.text}
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center gap-x-2 mr-4"
                onPress={() => handleLike(item.id)}
              >
                <FavouriteIcon size={20} color="#63656B" />
                <Text className="text-[14px] text-[#D2D3D5] font-PlusJakartaSansMedium">
                  {item.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mr-4 flex-row items-center gap-x-2"
                onPress={() => handleReply(item)}
              >
                <Comment02Icon size={20} color="#63656B" />
                <Text className="text-[14px] text-[#D2D3D5] font-PlusJakartaSansMedium">
                  Reply
                </Text>
              </TouchableOpacity>
              {item.replies && item.replies.length > 0 && (
                <TouchableOpacity onPress={() => handleReply(item)}>
                  <Text className="text-xs text-gray-500">
                    {item.replies.length} Replies
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* If there are replies and we want to show them inline */}
        {false && item.replies && item.replies.length > 0 && (
          <View className="ml-12 mt-2">
            {item.replies.map((reply) => (
              <View key={reply.id} className="mb-2">
                {/* Reply content here if we decide to show replies inline */}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderCommentInput = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      className={`border-t border-gray-800  w-full ${
        isKeyboardVisible ? "pb-0" : `pb-${insets.bottom}`
      }`}
    >
      <View className="flex-row items-center px-4 py-3">
        <Avatar
          source={{
            uri:
              userdata?.profileImage ||
              "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
          }}
          size={32}
          rounded
          containerStyle={{
            marginRight: 12,
            borderWidth: 1,
            borderColor: "#f4f4f4",
          }}
        />
        <View className="flex-1 flex-row items-center bg-[#202227] rounded-[12px] px-4 py-3 min-h-10">
          <TextInput
            ref={inputRef}
            className="flex-1 ml-2 text-[16px] text-[#f4f4f4] font-PlusJakartaSansMedium"
            placeholder={
              currentPage === "reply"
                ? `Reply to ${replyToComment?.user?.username}...`
                : "Write a comment..."
            }
            placeholderTextColor="#787A80"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          {commentText.trim() && (
            <TouchableOpacity
              className="absolute right-10 p-1"
              onPress={() => setCommentText("")}
            >
              <Text className="text-[#787A80] text-lg">×</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className={`absolute right-2.5 p-1 ${
              commentText.trim() ? "opacity-100" : "opacity-50"
            }`}
            onPress={handleSendComment}
            disabled={!commentText.trim() || isCommenting}
          >
            <SentIcon size={20} color="#f4f4f4" variant="solid" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  // Effect to handle bottom sheet visibility
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Effect to handle keyboard and bottom sheet interaction
  useEffect(() => {
    if (isKeyboardVisible && isVisible) {
      bottomSheetRef.current?.snapToIndex(1); // Only expand when both keyboard is visible and sheet is open
    }
  }, [isKeyboardVisible, isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#787A80", width: 40 }}
      backgroundStyle={{
        backgroundColor: "#111318",
        borderWidth: 1,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderColor: "#202227",
      }}
    >
      <BottomSheetView className="flex-1">
        <View className="flex-row items-center justify-center py-4 px-5 border-b border-gray-800">
          {currentPage === "comments" ? (
            <Text className="text-base font-bold text-gray-100">
              Comments ({commentsCount})
            </Text>
          ) : (
            <>
              <TouchableOpacity
                className="absolute left-5 flex-row items-center"
                onPress={() => {
                  setCurrentPage("comments");
                  setReplyToComment(null);
                }}
              >
                <ArrowLeft01Icon size={16} color="#787A80" />
                <Text className="text-gray-500 ml-1 text-sm">Back</Text>
              </TouchableOpacity>
              <Text className="text-base font-bold text-gray-100">
                Reply to {replyToComment?.user?.username}
              </Text>
              <View className="w-12" />
            </>
          )}
        </View>

        {renderCommentInput()}

        {currentPage === "comments" ? (
          <BottomSheetScrollView
            className="flex-1 min-h-full pb-24"
            contentContainerStyle={{ paddingBottom: 100, flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {data?.data?.comments && data.data.comments.length > 0 ? (
              data.data.comments.map((comment) =>
                renderComment({ item: comment })
              )
            ) : (
              <View className="flex-1 justify-center items-center pt-16">
                <Text className="text-gray-500 text-sm">No comments yet</Text>
              </View>
            )}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetScrollView
            className="p-4 pb-24"
            showsVerticalScrollIndicator={false}
          >
            {/* Original comment to which user is replying */}
            {replyToComment && renderComment({ item: replyToComment })}

            {/* Replies to this comment if any */}
            {replyToComment?.replies && replyToComment.replies.length > 0 && (
              <View className="mt-4">
                <Text className="text-sm font-bold text-gray-500 mb-3 ml-3">
                  Replies
                </Text>
                {replyToComment.replies.map((reply) =>
                  renderComment({ item: reply })
                )}
              </View>
            )}
          </BottomSheetScrollView>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CommentsBottomSheet;

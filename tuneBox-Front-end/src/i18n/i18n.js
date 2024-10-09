import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {

  en: {
    translation: {
      /////Gioi Thieu
        //NgheSiYeuThich
      "favorite_artist": "Who is your favorite artist?",
      "description": "Whether you're a musician or a fan, we want to hear from you. Introduce yourself and help us improve your TuneBox experience.",
      "search_placeholder": "Search for an artist...",
      "continue": "Continue",

        // GioiThieu
      "hero_title": "Discover the world of unlimited music",
      "hero_description": "At TuneBox, you can share, explore, and enjoy your favorite songs, as well as create personal playlists according to your preferences.",
      "hero_button": "Get Started",
      "about_title": "Create and share music",
      "about_description": "With a diverse community and rich interactive features, TuneBox offers you an amazing music experience and space to express your unique musical personality.",
      "music_for_all": "Music for everyone",

        // SoThich
      "talent_title": "What is your talent?",
      "talent_description": "Whether you're a musician or a fan, we want to hear from you. Introduce yourself and help us improve your TuneBox experience.",
      "search_talent_placeholder": "Search for a talent...",
      "continue": "Continue",

      // CreateUsername
      "create_username_title": "Create a username",
      "create_username_description": "Please choose a username for others to easily find you on TuneBox.",
      "username_placeholder": "Enter your username",

      // ForgotPassword
      "forgot_password_title": "Forgot Password",
      "forgot_password_description": "Enter your username or email",
      "forgot_password_placeholder": "Enter your username or email",
      "forgot_password_submit": "Send Email",
      "forgot_password_success": "An email has been sent. Please check your inbox.",
      "forgot_password_error": "No account found with this username or email.",
      
       // ResetPassword
       "reset_password_title": "Reset Password",
       "reset_password_description": "Enter your new password to reset your account.",
       "reset_password_new_placeholder": "New Password",
       "reset_password_confirm_placeholder": "Confirm Password",
       "reset_password_button": "Reset Password",
       "reset_password_success": "Password has been successfully reset.",
       "reset_password_error": "An error occurred. Please try again.",
       "reset_password_mismatch": "Passwords do not match.",

       // SignUp
      "signup_title": "Create Account",
      "signup_username": "Username",
      "signup_email": "Email",
      "signup_password": "Password",
      "signup_placeholder_username": "Enter your username",
      "signup_placeholder_email": "Enter your email address",
      "signup_placeholder_password": "Enter your password",
      "signup_button": "Sign Up",
      "signup_or_continue": "Or continue with",
      "signup_terms": "By continuing to create an account, you agree to TuneBox's terms.",
      "signup_login_prompt": "Already have an account? Login now.",
      "signup_error": "Email or username already exists.",
      "signup_connection_error": "Cannot connect to server.",

      // TheLoaiNhacYeuThich
      "genre_title": "What genres of music do you like?",
      "genre_description": "Whether you are a musician or a fan, we want to hear your opinion. Introduce yourself and help us improve your TuneBox experience.",
      "genre_search_placeholder": "Search for music genres",
      "genre_continue": "Continue",
      /////Gioi Thieu
      //Feed
      "news_feed": "News Feed",
      "following": "Following",
      "liked_posts": "Liked Posts",
      "liked_albums": "Liked Albums",
      "liked_playlists": "Liked Playlists",
      "placeholder_post": "What are you thinking?",
      "write_your_post": "Write your post here...",
      "post": "Post",
      "comment_placeholder": "Write a comment...",
      "view_comment": "View Comment",
      "comments_count": "{{count}} Comment",
      "user_greeting": "Hello everyone, welcome to my page!",
      "suggestions": "Suggestions to follow",
      "advertisement": "Advertisement",
      //Footer
      "home": "Home",
      "services": "Services",
      "resources": "Resources",
      "feedback": "Feedback",
      "about_us": "About Us",
      "contact_us": "Contact Us",
      "via_email": "Via Email:",
      "email_address": "tunebox@gmail.com",
      //Header
      "user_name": "User name",
      "profile": "Profile",
      "log_out": "Log Out",

      // ProfileSetting
  "profile_setting": "Profile Setting",
  "location": "Location",
  "search_city": "Search City",
  "add_gender": "Add Gender",
  "gender": "Gender",
  "day": "Day",
  "month": "Month",
  "year": "Year",
  "about": "About",

// ProfileUser
"profile.background": "Profile Background",
"profile.nickname": "Nickname",
"profile.name": "Name",
"profile.followers": "Followers",
"profile.following": "Following",
"profile.no_inspired_artists": "No inspired artists.",
"profile.no_talents": "No talents selected.",
"profile.no_favorite_genres": "No favorite genres.",
"profile.get_prime": "Get Prime",
"profile.edit_profile": "Edit Profile",
"profile.favorite_artists": "Favorite Artists",
"profile.talents": "Talents",
"profile.favorite_genres": "Favorite Genres",

           
    }
  },
  vi: {
    translation: {
        ///////Gioi Thieu
        //NgheSiYeuThich
      "favorite_artist": "Nghệ sĩ mà bạn yêu thích là ai?",
      "description": "Cho dù bạn là nhạc sĩ hay người hâm mộ, chúng tôi đều muốn nghe ý kiến của bạn. Giới thiệu bản thân và giúp chúng tôi cải thiện trải nghiệm TuneBox của bạn.",
      "search_placeholder": "Tìm kiếm nghệ sĩ...",
      "continue": "Tiếp tục",

        // GioiThieu
      "hero_title": "Khám phá thế giới âm nhạc không giới hạn",
      "hero_description": "Tại TuneBox, bạn có thể chia sẻ, khám phá và thưởng thức những bản nhạc yêu thích, cũng như tạo nên những playlist cá nhân theo sở thích.",
      "hero_button": "Bắt đầu",
      "about_title": "Sáng tạo và chia sẻ âm nhạc",
      "about_description": "Với cộng đồng đa dạng và tính năng tương tác phong phú, TuneBox mang đến cho bạn một trải nghiệm âm nhạc tuyệt vời và không gian để thể hiện cá tính âm nhạc của riêng bạn.",
      "music_for_all": "Âm nhạc đến với mọi người",
      
       // SoThich
      "talent_title": "Sở trường của bạn là gì?",
      "talent_description": "Cho dù bạn là nhạc sĩ hay người hâm mộ, chúng tôi đều muốn nghe ý kiến của bạn. Giới thiệu bản thân và giúp chúng tôi cải thiện trải nghiệm TuneBox của bạn.",
      "search_talent_placeholder": "Tìm kiếm sở trường...",
      "continue": "Tiếp tục",

      // CreateUsername
      "create_username_title": "Đặt tên người dùng",
      "create_username_description": "Hãy đặt tên người dùng để bạn bè và mọi người dễ dàng tìm kiếm bạn trên TuneBox.",
      "username_placeholder": "Nhập tên người dùng",

       // ForgotPassword
       "forgot_password_title": "Quên Mật Khẩu",
       "forgot_password_description": "Nhập Tên Tài Khoản Hoặc Email",
       "forgot_password_placeholder": "Nhập tên đăng nhập hoặc email của bạn",
       "forgot_password_submit": "Gửi Mail",
       "forgot_password_success": "Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
       "forgot_password_error": "Không tìm thấy tài khoản với tên đăng nhập hoặc email này.",

       // ResetPassword
      "reset_password_title": "Đặt lại mật khẩu",
      "reset_password_description": "Nhập mật khẩu mới của bạn để thiết lập lại tài khoản.",
      "reset_password_new_placeholder": "Mật khẩu mới",
      "reset_password_confirm_placeholder": "Xác nhận mật khẩu",
      "reset_password_button": "Đặt lại mật khẩu",
      "reset_password_success": "Mật khẩu đã được đặt lại thành công.",
      "reset_password_error": "Đã có lỗi xảy ra. Vui lòng thử lại.",
      "reset_password_mismatch": "Mật khẩu và xác nhận mật khẩu không khớp.",

      // SignUp
      "signup_title": "Tạo tài khoản",
      "signup_username": "Tên tài khoản",
      "signup_email": "Email",
      "signup_password": "Mật khẩu",
      "signup_placeholder_username": "Nhập tên tài khoản",
      "signup_placeholder_email": "Nhập địa chỉ email",
      "signup_placeholder_password": "Nhập mật khẩu",
      "signup_button": "Đăng kí",
      "signup_or_continue": "Hoặc tiếp tục với",
      "signup_terms": "Bằng cách tiếp tục tạo tài khoản bạn đã đồng ý với các điều khoản của TuneBox.",
      "signup_login_prompt": "Bạn đã có tài khoản? Đăng nhập ngay.",
      "signup_error": "Email hoặc tên tài khoản đã tồn tại.",
      "signup_connection_error": "Không thể kết nối đến server.",

      // TheLoaiNhacYeuThich
      "genre_title": "Bạn yêu thích thể loại nhạc nào?",
      "genre_description": "Cho dù bạn là nhạc sĩ hay người hâm mộ, chúng tôi đều muốn nghe ý kiến của bạn. Giới thiệu bản thân và giúp chúng tôi cải thiện trải nghiệm TuneBox của bạn.",
      "genre_search_placeholder": "Tìm kiếm thể loại nhạc",
      "genre_continue": "Tiếp tục",
      /////Gioi Thieu
        
        //Feed
          "news_feed": "Bản tin",
          "following": "Đang theo dõi",
          "liked_posts": "Bài viết đã thích",
          "liked_albums": "Albums đã thích",
          "liked_playlists": "Playlist đã thích",
          "placeholder_post": "Ban đang nghĩ gì vậy?",
          "write_your_post": "Viết bài đăng của bạn ở đây...",
          "post": "Đăng",
          "comment_placeholder": "Viết bình luận...",
          "view_comment": "Xem Bình luận",
          "comments_count": "1 Bình luận",
          "user_greeting": "Xin chào mọi người, đã đến với trang của mình!",
          "suggestions": "Gợi ý theo dõi",
          "advertisement": "Quảng cáo",
      //Footer
      "home": "Trang chủ",
      "services": "Dịch vụ",
      "resources": "Tài nguyên",
      "feedback": "Góp ý",
      "about_us": "Giới thiệu",
      "contact_us": "Liên hệ với chúng tôi",
      "via_email": "Thông qua Email:",
      "email_address": "tunebox@gmail.com",

      //Header
      "user_name": "Tên người dùng",
      "profile": "Hồ sơ",
      "log_out": "Đăng xuất",
      // ProfileUser
      "profile.background": "Hình nền profile",
      "profile.nickname": "Tên hiển thị",
      "profile.name": "Tên",
      "profile.followers": "Người theo dõi",
      "profile.following": "Đang theo dõi",
      "profile.no_inspired_artists": "Không có nghệ sĩ ưu thích nào.",
      "profile.no_talents": "Chưa chọn sở trường.",
      "profile.no_favorite_genres": "Không có dòng nhạc ưu thích nào.",
      "profile.get_prime": "Mua Prime",
      "profile.edit_profile": "Chỉnh sửa Hồ sơ",
      "profile.favorite_artists": "Nghệ sĩ ưu thích",
      "profile.talents": "Sở trường",
      "profile.favorite_genres": "Dòng nhạc ưu thích",
      // ProfileSetting
        "profile_setting": "Cài Đặt Hồ Sơ",
        "location": "Địa điểm",
        "search_city": "Tìm kiếm thành phố",
        "add_gender": "Thêm giới tính",
        "gender": "Giới tính",
        "day": "Ngày",
        "month": "Tháng",
        "year": "Năm",
        "about": "Giới thiệu"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

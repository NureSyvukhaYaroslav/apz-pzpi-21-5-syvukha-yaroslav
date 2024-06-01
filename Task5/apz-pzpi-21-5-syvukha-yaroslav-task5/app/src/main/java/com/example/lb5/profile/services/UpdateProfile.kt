import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import org.json.JSONObject

class UpdateProfile(private val context: Context) {
    suspend fun updateProfile(email: String, nickname: String, pref: MyPreferences): Boolean = withContext(Dispatchers.IO) {
        val url = URL("http://192.168.10.133:3000/api/profile")

        val postData = "email=${URLEncoder.encode(email, StandardCharsets.UTF_8.name())}&nickname=${URLEncoder.encode(nickname, StandardCharsets.UTF_8.name())}"
        val postDataBytes = postData.toByteArray(StandardCharsets.UTF_8)

        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "PATCH"
        connection.setRequestProperty("Authorization", pref.getValueStr("accessToken"))
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
        connection.setRequestProperty("Content-Length", postDataBytes.size.toString())
        connection.doOutput = true
        connection.outputStream.write(postDataBytes)

        val responseCode = connection.responseCode
        println("Response code: $responseCode")

        return@withContext if (responseCode == HttpURLConnection.HTTP_OK) {
            true
        } else {
            false
        }
    }
}
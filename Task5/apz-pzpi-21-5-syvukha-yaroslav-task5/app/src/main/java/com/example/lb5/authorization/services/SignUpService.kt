import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import org.json.JSONObject

class SignUpService(private val context: Context) {
    private val PREFS_NAME = "com.myapp.preferences"
    private val ACCESS_TOKEN = "accessToken"
    private val sharedPref = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    suspend fun signUp(email: String, password: String, nickname: String): Boolean = withContext(Dispatchers.IO) {
        val url = URL("http://192.168.10.133:3000/api/auth/signup")

        val postData = "email=${URLEncoder.encode(email, StandardCharsets.UTF_8.name())}&password=${URLEncoder.encode(password, StandardCharsets.UTF_8.name())}"
        val postDataBytes = postData.toByteArray(StandardCharsets.UTF_8)

        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "POST"
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
        connection.setRequestProperty("Content-Length", postDataBytes.size.toString())
        connection.doOutput = true
        connection.outputStream.write(postDataBytes)

        val responseCode = connection.responseCode
        println("Response code: $responseCode")

        return@withContext if (responseCode == HttpURLConnection.HTTP_CREATED) {
            val inputStream = connection.inputStream
            val content = inputStream.bufferedReader().use { it.readText() }
            println("Response content: $content")

            val jsonObject = JSONObject(content)
            val accessToken = jsonObject.getString("accessToken")

            val editor = sharedPref.edit()
            editor.putString(ACCESS_TOKEN, accessToken)
            editor.apply()

            true
        } else {
            true
        }
    }
}
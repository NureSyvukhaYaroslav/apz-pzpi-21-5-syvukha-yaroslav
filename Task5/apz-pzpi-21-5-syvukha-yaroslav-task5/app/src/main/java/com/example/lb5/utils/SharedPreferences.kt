import android.content.Context
import android.content.SharedPreferences

class MyPreferences(context: Context) {
    private val PREFS_NAME = "com.myapp.preferences"
    private val sharedPref: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun save(KEY_NAME: String, value: String) {
        val editor: SharedPreferences.Editor = sharedPref.edit()

        editor.putString(KEY_NAME, value)
        editor.apply()
    }

    fun getValueStr(KEY_NAME: String): String? {
        return sharedPref.getString(KEY_NAME, "!!!")
    }
}
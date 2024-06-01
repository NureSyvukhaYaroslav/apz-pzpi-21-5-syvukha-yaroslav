package com.example.lb5.profile.activities

import MyPreferences
import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.ComponentActivity
import com.example.lb5.R
import com.example.lb5.authorization.activities.SignInActivity
import com.example.lb5.document.activities.DocumentsActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale

class ProfileActivity : ComponentActivity() {

    private lateinit var emailTextView: TextView
    private lateinit var nicknameTextView: TextView
    private lateinit var updateProfileButton: Button
    private lateinit var logOutButton: Button
    private lateinit var documentsButton : Button
    private lateinit var pref: MyPreferences
    private lateinit var englishButton: Button
    private lateinit var ukrainianButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        emailTextView = findViewById(R.id.emailTextView)
        nicknameTextView = findViewById(R.id.nicknameTextView)
        updateProfileButton = findViewById(R.id.updateProfileButton)
        logOutButton = findViewById(R.id.logOutButton)
        documentsButton = findViewById(R.id.toDocumentsButton)
        pref = MyPreferences(this)
        englishButton = findViewById(R.id.english)
        ukrainianButton = findViewById(R.id.ukrainian)

        CoroutineScope(Dispatchers.IO).launch {
            val profileUrl = URL("http://192.168.10.133:3000/api/profile")
            val profileConnection = profileUrl.openConnection() as HttpURLConnection
            profileConnection.requestMethod = "GET"
            profileConnection.setRequestProperty("Authorization", pref.getValueStr("accessToken"))

            val inputStream = profileConnection.inputStream
            val content = inputStream.bufferedReader().use { it.readText() }

            val profileJsonObject = JSONObject(content)

            withContext(Dispatchers.Main) {
                emailTextView.text = profileJsonObject.getString("email")
                nicknameTextView.text = profileJsonObject.getString("nickname")
            }
        }

        updateProfileButton.setOnClickListener {
            val intent = Intent(this, UpdateProfileActivity::class.java)
            startActivity(intent)
        }

        logOutButton.setOnClickListener {
            pref.save("accessToken", "")

            val intent = Intent(this, SignInActivity::class.java)
            startActivity(intent)
        }

        documentsButton.setOnClickListener {
            val intent = Intent(this, DocumentsActivity::class.java)
            startActivity(intent)
        }

        englishButton.setOnClickListener {
            val locale = Locale("en")
            Locale.setDefault(locale)
            val config = Configuration()
            config.locale = locale
            baseContext.resources.updateConfiguration(config, baseContext.resources.displayMetrics)
            recreate()
        }

        ukrainianButton.setOnClickListener {
            val locale = Locale("uk")
            Locale.setDefault(locale)
            val config = Configuration()
            config.locale = locale
            baseContext.resources.updateConfiguration(config, baseContext.resources.displayMetrics)
            recreate()
        }
    }
}
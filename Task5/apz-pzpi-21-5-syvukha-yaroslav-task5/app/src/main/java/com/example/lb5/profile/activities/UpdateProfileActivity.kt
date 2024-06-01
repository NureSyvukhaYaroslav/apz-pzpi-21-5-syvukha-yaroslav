package com.example.lb5.profile.activities

import MyPreferences
import UpdateProfile
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.example.lb5.R
import kotlinx.coroutines.launch

class UpdateProfileActivity : ComponentActivity() {

    private lateinit var emailEditText: EditText
    private lateinit var nicknameEditText: EditText
    private lateinit var updateProfileButton: Button
    private lateinit var toProfileButton: Button
    private lateinit var pref: MyPreferences
    private lateinit var service: UpdateProfile

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.update_activity_profile)

        emailEditText = findViewById(R.id.email)
        nicknameEditText = findViewById(R.id.nickname)
        updateProfileButton = findViewById(R.id.updateProfileButton)
        toProfileButton = findViewById(R.id.toProfile)
        service = UpdateProfile(this)
        pref = MyPreferences(this)

        updateProfileButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val nickname = nicknameEditText.text.toString()

            lifecycleScope.launch {
                val success = service.updateProfile(email, nickname, pref)
                if (success) {
                    Toast.makeText(this@UpdateProfileActivity, "Updated", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this@UpdateProfileActivity, ProfileActivity::class.java)
                    startActivity(intent)
                } else {
                    Toast.makeText(this@UpdateProfileActivity, "Some error occurred", Toast.LENGTH_SHORT).show()
                }
            }

        }

        toProfileButton.setOnClickListener {
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
        }
    }
}
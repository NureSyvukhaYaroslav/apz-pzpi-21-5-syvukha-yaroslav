package com.example.lb5.authorization.activities

import MyPreferences
import com.example.lb5.profile.activities.ProfileActivity
import SignInService
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.example.lb5.R
import kotlinx.coroutines.launch

class SignInActivity : ComponentActivity() {

    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var signInButton: Button
    private lateinit var toSignUpButton: Button
    private lateinit var signInService: SignInService
    private lateinit var pref: MyPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_in)

        signInService = SignInService(this)

        emailEditText = findViewById(R.id.email)
        passwordEditText = findViewById(R.id.password)
        signInButton = findViewById(R.id.sign_in)
        toSignUpButton = findViewById(R.id.to_sign_up)
        pref = MyPreferences(this)

        signInButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            lifecycleScope.launch {
                val success = signInService.signIn(email, password)

                if (success) {
//                    Toast.makeText(this@SignInActivity, "You signed in", Toast.LENGTH_SHORT).show()

                    val accessToken = pref.getValueStr("accessToken")

                    Toast.makeText(this@SignInActivity, accessToken, Toast.LENGTH_SHORT).show()

                    val intent = Intent(this@SignInActivity, ProfileActivity::class.java)
                    startActivity(intent)
                } else {
                    Toast.makeText(this@SignInActivity, "Some error occurred", Toast.LENGTH_SHORT).show()
                }
            }
        }
        
        toSignUpButton.setOnClickListener {
            val intent = Intent(this, SignUpActivity::class.java)
            startActivity(intent)
        }
    }
}
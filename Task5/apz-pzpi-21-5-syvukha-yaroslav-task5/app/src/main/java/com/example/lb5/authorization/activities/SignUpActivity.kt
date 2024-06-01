package com.example.lb5.authorization.activities

import SignUpService
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.example.lb5.R
import com.example.lb5.profile.activities.ProfileActivity
import kotlinx.coroutines.launch

class SignUpActivity : ComponentActivity() {

    private lateinit var emailEditText: EditText
    private lateinit var nicknameEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var signUpButton: Button
    private lateinit var toSignInButton: Button
    private lateinit var signInService: SignUpService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)

        emailEditText = findViewById(R.id.email)
        nicknameEditText = findViewById(R.id.nickname)
        passwordEditText = findViewById(R.id.password)
        signUpButton = findViewById(R.id.sign_up)
        toSignInButton = findViewById(R.id.to_sign_in)

        signInService = SignUpService(this)


        signUpButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()
            val nickname = nicknameEditText.text.toString()

            lifecycleScope.launch {
                val success = signInService.signUp(email, password, nickname)
                if (success) {
                    Toast.makeText(this@SignUpActivity, "You signed up!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@SignUpActivity, "Some error occurred", Toast.LENGTH_SHORT).show()
                }
            }
        }

        toSignInButton.setOnClickListener {
            val intent = Intent(this, SignInActivity::class.java)
            startActivity(intent)
        }
    }
}
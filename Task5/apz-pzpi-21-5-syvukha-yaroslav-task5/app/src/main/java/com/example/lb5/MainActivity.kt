package com.example.lb5

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import com.example.lb5.authorization.activities.SignInActivity

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

       val intent = Intent(this, SignInActivity::class.java)
       startActivity(intent)
    }
}
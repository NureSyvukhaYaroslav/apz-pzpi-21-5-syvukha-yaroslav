package com.example.lb5.document.activities

import MyPreferences
import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.example.lb5.R
import com.example.lb5.document.DocumentService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class UpdateDocumentsActivity : AppCompatActivity() {

    private lateinit var documentTypeText: EditText
    private lateinit var button: Button
    private lateinit var documentService: DocumentService
    private lateinit var pref: MyPreferences
    private lateinit var documentId: String

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_update_document)

        documentTypeText = findViewById(R.id.documentType)
        button = findViewById(R.id.updateDocumentButton)
        documentService = DocumentService()
        pref = MyPreferences(this)

        documentId = intent.getStringExtra("documentId").toString()

        button.setOnClickListener {
            CoroutineScope(Dispatchers.IO).launch {
                documentService.updateDocument(documentId, documentTypeText.text.toString(), pref)
                val intent = Intent(this@UpdateDocumentsActivity, DocumentsActivity::class.java)
                startActivity(intent)
            }
        }
    }
}
package com.example.lb5.document.activities

import MyPreferences
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.lb5.R
import com.example.lb5.document.DocumentService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DocumentsActivity : AppCompatActivity() {

    private lateinit var documentsRecyclerView: RecyclerView
    private lateinit var documentService: DocumentService
    private lateinit var pref: MyPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_documents)

        documentService = DocumentService()
        pref = MyPreferences(this)

        documentsRecyclerView = findViewById(R.id.documents_recycler_view)
        documentsRecyclerView.layoutManager = LinearLayoutManager(this)

        CoroutineScope(Dispatchers.IO).launch {
            val documents = documentService.fetchDocuments(pref)
            withContext(Dispatchers.Main) {
                documentsRecyclerView.adapter = DocumentAdapter(documents, pref, documentService)
            }
        }
    }
}
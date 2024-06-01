package com.example.lb5.document.activities

import MyPreferences
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.core.content.ContextCompat.startActivity
import androidx.lifecycle.findViewTreeLifecycleOwner
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.RecyclerView
import com.example.lb5.R
import com.example.lb5.document.DocumentService
import com.example.lb5.document.models.Document
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class DocumentAdapter(private val documents: List<Document>, private val pref: MyPreferences, private val documentService: DocumentService) : RecyclerView.Adapter<DocumentAdapter.DocumentViewHolder>() {

    class DocumentViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val type: TextView = itemView.findViewById(R.id.document_type)
        val createdAt: TextView = itemView.findViewById(R.id.document_created_at)
        val documentType: TextView = itemView.findViewById(R.id.document_document_type)
        val id: TextView = itemView.findViewById(R.id.document_id)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DocumentViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.document_item, parent, false)
        return DocumentViewHolder(view)
    }

    override fun onBindViewHolder(holder: DocumentViewHolder, position: Int) {
        val document = documents[position]
        holder.type.text = document.type
        holder.createdAt.text = document.createdAt
        holder.documentType.text = document.documentType
        holder.id.text = document.id

        CoroutineScope(Dispatchers.IO).launch {
          val downloadButton = holder.itemView.findViewById<Button>(R.id.document_download_button)
          downloadButton.setOnClickListener {
              holder.itemView.findViewTreeLifecycleOwner()?.lifecycleScope?.launch {
                  documentService.downloadDocument(pref, document.id)
              }
          }

        val updateButton = holder.itemView.findViewById<Button>(R.id.update_document)
            updateButton.setOnClickListener {
                val intent = Intent(holder.itemView.context, UpdateDocumentsActivity::class.java)
                intent.putExtra("documentId", document.id)
                startActivity(holder.itemView.context, intent, null)
            }
        }
    }

    override fun getItemCount() = documents.size
}
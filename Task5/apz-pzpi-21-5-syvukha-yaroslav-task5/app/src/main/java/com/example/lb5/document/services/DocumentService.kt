package com.example.lb5.document

import MyPreferences
import android.os.Environment
import com.example.lb5.document.models.Document
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

class DocumentService {
  suspend fun fetchDocuments(pref: MyPreferences): List<Document> = withContext(Dispatchers.IO) {
        val url = URL("http://192.168.10.133:3000/api/document")
        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "GET"
        connection.setRequestProperty("Authorization", pref.getValueStr("accessToken"))


        val inputStream = connection.inputStream
        val content = inputStream.bufferedReader().use { it.readText() }
        val jsonArray = JSONArray(content)
        val documents = mutableListOf<Document>()
        for (i in 0 until jsonArray.length()) {
            val jsonObject = jsonArray.getJSONObject(i)
            val document = Document(
                jsonObject.getString("id"),
                jsonObject.getString("type"),
                jsonObject.getString("createdAt"),
                jsonObject.getString("userId"),
                if (jsonObject.isNull("organizationId")) null else jsonObject.getString("organizationId"),
                jsonObject.getString("documentType")
            )
            documents.add(document)
        }
        documents
    }

  suspend fun downloadDocument(pref: MyPreferences, documentId: String) = withContext(Dispatchers.IO) {
    val url = URL("http://192.168.10.133:3000/api/document/$documentId")
    val connection = url.openConnection() as HttpURLConnection
    connection.requestMethod = "GET"
    connection.setRequestProperty("Authorization", pref.getValueStr("accessToken"))

    val inputStream = connection.inputStream
    val file = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "$documentId.pdf")
    inputStream.use { input ->
        file.outputStream().use { fileOut ->
            input.copyTo(fileOut)
        }
    }
  }

    suspend fun updateDocument(documentId: String, documentType: String, pref: MyPreferences): Boolean = withContext(Dispatchers.IO)  {
      val url = URL("http://192.168.10.133:3000/api/document/update/${documentId}")

      val postData = "documentType=${URLEncoder.encode(documentType, StandardCharsets.UTF_8.name())}"
      val postDataBytes = postData.toByteArray(StandardCharsets.UTF_8)

      val connection = url.openConnection() as HttpURLConnection
      connection.requestMethod = "POST"
      connection.setRequestProperty("Authorization", pref.getValueStr("accessToken"))
      connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
      connection.setRequestProperty("Content-Length", postDataBytes.size.toString())
      connection.doOutput = true
      connection.outputStream.write(postDataBytes)

      val responseCode = connection.responseCode
      println("Response code: $responseCode")

      return@withContext responseCode == HttpURLConnection.HTTP_OK
    }
}
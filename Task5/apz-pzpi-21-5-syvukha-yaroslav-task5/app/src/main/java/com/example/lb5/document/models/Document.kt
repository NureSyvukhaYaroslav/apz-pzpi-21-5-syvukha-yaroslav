package com.example.lb5.document.models

data class Document(
    val id: String,
    val type: String,
    val createdAt: String,
    val userId: String,
    val organizationId: String?,
    val documentType: String
)
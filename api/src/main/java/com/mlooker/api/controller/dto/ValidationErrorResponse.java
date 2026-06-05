package com.mlooker.api.controller.dto;

import java.util.List;

public record ValidationErrorResponse(List<FieldError> errors) {

	public record FieldError(String field, String message) {
	}
}

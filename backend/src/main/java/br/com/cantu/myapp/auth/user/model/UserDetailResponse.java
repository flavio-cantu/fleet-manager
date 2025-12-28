package br.com.cantu.myapp.auth.user.model;

import lombok.Builder;

@Builder
public record UserDetailResponse(
		Long id,
		String name,
		String username,
		String email,
		boolean active
//		,
//		Group group,
//		Unity unity
) {
}

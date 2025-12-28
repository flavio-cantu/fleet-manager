package br.com.cantu.myapp.auth.user.model;

import lombok.Builder;

@Builder
public record SaveUser(
		String username,
		String name,
		String email,
		boolean active
//		,
//		Group group,
//		Unity unity
) {
}

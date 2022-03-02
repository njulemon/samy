import secrets


def key_generate(length_bytes: int):
    return secrets.token_urlsafe(length_bytes)

import msal

config = {
        "authority": "https://login.microsoftonline.com/<TenantId>",
        "client_id": "<client-Id>",
        "scope": [ "api://<scope>/.default" ],
        "thumbprint": "<thumbprint azure service principal>",
        "private_key_file": "path-certificate"
}

app = msal.ConfidentialClientApplication(
    config["client_id"], authority=config["authority"],
    client_credential={"thumbprint": config["thumbprint"], "private_key": open(config['private_key_file']).read()},
)

result = app.acquire_token_for_client(scopes=config["scope"])

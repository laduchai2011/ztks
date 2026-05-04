INSERT INTO dbo.zaloApp (label, appId, appName, appSecret, status, accountId, updateTime, createTime)
VALUES ('5k aquarium', '2474292114893114248', '5k aquarium', '7XFkowzBCeRBRGqDhUkL', 'normal', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

INSERT INTO dbo.zaloOa (label, oaId, oaName, oaSecret, status, zaloAppId, accountId, updateTime, createTime)
VALUES ('5k aquarium 1 (OA)', '2018793888801741528', '5kcacanh1', 'iRf70Tagp3qpjVYuYWld', 'normal', 1, 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

INSERT INTO dbo.zaloOaToken (refreshToken, zaloOaId)
VALUES ('mpMt8MQr_t76CBGiRBtzTCyzjIbbfwO6aqov1pcvX1hSN8emUA2H08Xth3jCjw4Jb4Zh7cIavoIQQF4XSOZ5VuS4oqbG_iCGh1NuFtoHzZ-W5xGRL_IhDeynlXriyen5oG64LcZ_Y6Z30S5U2_dFNDXwy5HwYE1NW4xjQa6Onp2CHCqARhxWBwXleWHldQehh1_aCmV_x3Bc9k4-6TtMO-nTncmthUjqt57QM7YFzmYrQTmx5eJ-1DjewnSAWwSppLMtTmtJh7tv8UDkAQVrKUvapc4TfUvZsY3WVG_3g22k8wGPQU6g0CuWl5qtmhy1tmM91mZmdnhfTxCn2FkFDDW5i1merAKqmpAf3HBUkbAt0QXB5lV_UD88oauM-VDriYc-S47mYL2S7BTQTFcrQfmRWpEIj7ffPQ__V0', 4)

UPDATE dbo.zaloOaToken WITH (ROWLOCK)
SET refreshToken = 'kqm9MSqBdqk-IGfKnmETJhT42r7E6VmSzYiwHiykvrdq4YWe_03UQTK_ANNP1BeEh19dTeic-Ygx40Til0ZMSwf36H-CQFnOlLqV49TvZaoaQLbAarwv2QT2UH6y0gj8p4HNATnckMZBNabr_NxQEDrX3q3gVvCfw4rIJFPkWYdpPq0nzqAbIzfvKrAiQRO1c75gTR1AYHgvVqXeicsP1BnNILoH4QmFbGK_4xn3pLAJ7GisXGoOUuyfPMUSQgG5xJHqPlLsb3lwSNiasJgOT_4VU0py0kXKzGKa9lSUxaVrD1aS_Y6BNFaLGKRVBg1VrGrC7DyXfWVy679XZ5EbVu94DndkKSS4tqKYTz4EqXZR3YLPqIdHFEOv4qwUEz5La30oJEDthp-FNafOksIQDcvYGNEaAyuHdqO'
WHERE zaloOaId = 1
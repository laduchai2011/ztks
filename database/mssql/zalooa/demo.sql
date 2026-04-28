INSERT INTO dbo.zaloApp (label, appId, appName, appSecret, status, accountId, updateTime, createTime)
VALUES ('5k aquarium', '2474292114893114248', '5k aquarium', '7XFkowzBCeRBRGqDhUkL', 'normal', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

INSERT INTO dbo.zaloOa (label, oaId, oaName, oaSecret, status, zaloAppId, accountId, updateTime, createTime)
VALUES ('5k aquarium 1 (OA)', '2018793888801741528', '5kcacanh1', 'iRf70Tagp3qpjVYuYWld', 'normal', 1, 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

INSERT INTO dbo.zaloOaToken (refreshToken, zaloOaId)
VALUES ('mpMt8MQr_t76CBGiRBtzTCyzjIbbfwO6aqov1pcvX1hSN8emUA2H08Xth3jCjw4Jb4Zh7cIavoIQQF4XSOZ5VuS4oqbG_iCGh1NuFtoHzZ-W5xGRL_IhDeynlXriyen5oG64LcZ_Y6Z30S5U2_dFNDXwy5HwYE1NW4xjQa6Onp2CHCqARhxWBwXleWHldQehh1_aCmV_x3Bc9k4-6TtMO-nTncmthUjqt57QM7YFzmYrQTmx5eJ-1DjewnSAWwSppLMtTmtJh7tv8UDkAQVrKUvapc4TfUvZsY3WVG_3g22k8wGPQU6g0CuWl5qtmhy1tmM91mZmdnhfTxCn2FkFDDW5i1merAKqmpAf3HBUkbAt0QXB5lV_UD88oauM-VDriYc-S47mYL2S7BTQTFcrQfmRWpEIj7ffPQ__V0', 4)

UPDATE dbo.zaloOaToken WITH (ROWLOCK)
SET refreshToken = 'cdZl9hedB66VVUmhi2ykP9PmxIwvDMeO_WpiBjmfPpAD1DK_r3vd3uaVn3IcEtyFooJ02B8CM4JjCTDsb6fQHCfNw5YSLb1LsGYMJFPRBcBGLf59W7GP1gPrZXNBUYOYbIAL5h1-BXh8Lkq3c4Sh2CH6bIRZQ1C2jtAu6D8q8rMoA-iRrYrR2AupaYFJErODy3dkIju1HbQ11ErXnbn5Axru-YVaT4eHkIpt5zm1GGM7H_O-r4Tr6AfsuIZjUtyrbcF59CXjS2gmLRSXa0WGARytWZlDA080i7Qg9_ukFcwd7P0WuZ9L6QKM_GtGDteUfXNKB8G_LYJT0zG3bHXZJySaocM_OdvX-qp1QTfiNcxqSS1Qrdz4JuDOt7pWTMericVlSk169sQY6O12spOYLsPs5slnVhazB6m'
WHERE zaloOaId = 1
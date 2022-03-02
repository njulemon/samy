#!/bin/sh

function call_webhook {
    echo ----------------------------------------
    echo Call http://localhost/cron_webhook/
    curl -v -H "X_FORWARDED_PROTO:https" http://localhost/cron_webhook/
    }

function cron_webhook {
    call_webhook
    while sleep 3600; do
        call_webhook
    done
}

cron_webhook
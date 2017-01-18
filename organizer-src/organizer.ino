#include "HttpClient/HttpClient.h"

// Put power on an output pin to get full 5V
int power = D6;
// TODO replace with button when available
int button = D0;
int led = D1;
// Client variable to send requests
HttpClient http;

// Headers currently need to be set at init, useful for API keys etc.
http_header_t headers[] = {
    { "Content-Type", "application/json" },
    { "Accept" , "*/*"},
    { NULL, NULL } // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;

void setup() {
    pinMode(power, OUTPUT);
    pinMode(led, OUTPUT);
    // Set power to always on
    digitalWrite(power, HIGH);
    pinMode(button, INPUT);
    // TODO update once deployed
    request.hostname = "10.100.100.171";
    request.port = 3000;
    // TODO update path param when key function is created
    request.path = "/organizer/banana";
}

void loop() {
    if(digitalRead(button)) {
        digitalWrite(led, HIGH);
        String reqBody = String("{\"status\":" + String(digitalRead(button), DEC) + " }");
        request.body = reqBody;
        http.post(request, response, headers);
        delay(1000);
        digitalWrite(led, LOW);
        for (int i = 0; i < 10; i++) {
            digitalWrite(led, HIGH);
            delay(500);
            digitalWrite(led, LOW);
            delay(500);
        }
    }

}

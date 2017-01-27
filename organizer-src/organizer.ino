#include "HttpClient/HttpClient.h"
#define HOSTNAME "10.100.100.150"

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
    request.hostname = HOSTNAME;
    // request.hostname = "medtrx.herokuapp.com";
    request.port = 3000;
    // request.port = 80;
    // TODO update path param when key function is created
    request.path = "/organizer/506f9762d1514b6b8281fa480085df55";
}

void loop() {
    if(digitalRead(button)) {
        digitalWrite(led, HIGH);
        String reqBody = String("{\"status\": true }");
        request.body = reqBody;
        Serial.println(request.hostname);
        http.post(request, response, headers);
        Serial.println(response.status);
        Serial.println(response.body);
        delay(300);
        digitalWrite(led, LOW);
        for (int i = 0; i < 10; i++) {
            digitalWrite(led, HIGH);
            delay(100);
            digitalWrite(led, LOW);
            delay(100);
        }
    }

}

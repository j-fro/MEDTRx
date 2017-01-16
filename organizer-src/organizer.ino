#include "HttpClient/HttpClient.h"

// Put power on an output pin to get full 5V
int power = D0;
// TODO replace with button when available
int photosensor = A0;
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
    // Set power to always on
    digitalWrite(power, HIGH);
    pinMode(photosensor, INPUT);
    // TODO update once deployed
    request.hostname = "10.100.100.66";
    request.port = 3000;
    // TODO update path param when key function is created
    request.path = "/organizer/banana";
}

void loop() {
    // TODO update when button is available
    String reqBody = String("{\"photosensor reading\":" + String(analogRead(photosensor), DEC) + " }");
    request.body = reqBody;
    http.post(request, response, headers);
    delay(1000);
}

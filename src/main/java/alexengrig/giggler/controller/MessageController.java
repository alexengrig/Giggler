package alexengrig.giggler.controller;

import alexengrig.giggler.domain.Message;
import alexengrig.giggler.repository.MessageRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static alexengrig.giggler.controller.APIURLs.API_MESSAGE_URL;

@RestController
@RequestMapping(API_MESSAGE_URL)
public class MessageController {

    private final MessageRepository messageRepository;


    @Autowired
    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }


    @PostMapping
    public ResponseEntity<?> createMessage(@RequestBody Message message) {
        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("{messageId}")
    public ResponseEntity<?> getMessage(@PathVariable("messageId") Message message) {
        return ResponseEntity.ok(message);
    }

    @PutMapping("{messageId}")
    public ResponseEntity<?> updateMessage(@PathVariable("messageId") Message messageFromDb,
                                           @RequestBody Message message) {
        BeanUtils.copyProperties(message, messageFromDb);
        Message updatedMessage = messageRepository.save(messageFromDb);
        return ResponseEntity.ok(updatedMessage);
    }

    @DeleteMapping("{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable("messageId") Message message) {
        messageRepository.delete(message);
        return ResponseEntity.ok().build();
    }


    @GetMapping
    public ResponseEntity<?> getMessages() {
        return ResponseEntity.ok(messageRepository.findAll());
    }

}

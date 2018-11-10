function getIndex(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
};

var messageApi = Vue.resource('/api/message{/messageId}');

Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function() {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        messageAttr: function(newValue, oldValue) {
            this.text = newValue.text;
            this.id = newValue.id;
        }
    },
    template:
        '<div>' +
            '<input type="text" placeholder="Write your text" v-model="text" />' +
            '<input type="button" value="Save" @click="save"/>' +
        '</div>',
    methods: {
        save: function() {
            var message = {text: this.text};
            if (this.id) {
                messageApi.update({messageId: this.id}, message).then(result => {
                    result.json().then(data => {
                        var index = getIndex(this.messages, data.id);
                        this.messages.splice(index, 1, data);
                    })
                })
            } else {
                messageApi.save({}, message).then(result => {
                    result.json().then(data => {
                        this.messages.push(data);
                    })
                })
            }
            this.text = '';
            this.id = '';
        }
    }
});

Vue.component('message-row', {
    props: ['message', 'editMethod', 'messages'],
    template:
        '<div>' +
            '<i>({{message.id}})</i> ' +
            '{{message.text}} ' +
            '<span>' +
                '<input type="button" value="Edit" @click="edit" />' +
                '<input type="button" value="X" @click="del" />' +
            '</span>' +
        '</div>',
    methods: {
        edit: function() {
            this.editMethod(this.message);
        },
        del: function(){
            messageApi.remove({messageId: this.message.id}).then(result => {
                if (result.ok) {
                    this.messages.splice(this.messages.indexOf(this.message), 1)
                }
            })
        }
    }
});

Vue.component('message-list', {
    props: ['messages'],
    data: function() {
        return {
            message: null
        }
    },
    template:
        '<div>' +
            '<message-form :messages="messages" :messageAttr="message" />' +
            '<message-row v-for="message in messages" :key="message.id" :messages="messages" :message="message" ' +
                ':editMethod="editMethod" />' +
        '</div>',
    created: function() {
        messageApi.get().then(result => {
            result.json().then(data => {
                data.forEach(message => this.messages.push(message))
            })
        })
    },
    methods: {
        editMethod: function(message) {
            this.message = message;
        }
    }
});

var app = new Vue({
    el: '#app',
    template:
        '<message-list :messages="messages" />',
    data: {
        messages: []
    }
});

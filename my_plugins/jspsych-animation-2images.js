/**
 * jsPsych plugin for showing animations and recording keyboard responses
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 */

jsPsych.plugins['animation-2images'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('animation-2images', 'stimuli_left', 'image');
  jsPsych.pluginAPI.registerPreload('animation-2images', 'stimuli_right', 'image');
  
  plugin.info = {
    name: 'animation-2images',
    description: '',
    parameters: {
      stimuli_left: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimuli Left',
        default: undefined,
        array: true,
        description: 'The images to be displayed left.'
      },
      stimuli_right: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimuli Right',
        default: undefined,
        array: true,
        description: 'The images to be displayed right.'
      },
      frame_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Frame time',
        default: 250,
        description: 'Duration to display each image.'
      },
      frame_isi: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Frame gap',
        default: 0,
        description: 'Length of gap to be shown between each image.'
      },
      sequence_reps: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sequence repetitions',
        default: 1,
        description: 'Number of times to show entire sequence.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        array: true,
        description: 'Keys subject uses to respond to stimuli.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below stimulus.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var interval_time = trial.frame_time + trial.frame_isi;
    var animate_frame = -1;
    var reps = 0;
    var startTime = performance.now();
    var animation_sequence = [];
    var responses = [];
    var current_stim = "";
	var seq_length = Math.max(trial.stimuli_left.length, trial.stimuli_right.length);

    var animate_interval = setInterval(function() {
      var showImage = true;      
      animate_frame++;
      if (animate_frame == seq_length) {
        animate_frame = 0;
        reps++;
        if (reps >= trial.sequence_reps) {
		  display_element.innerHTML = ''; // clear everything (moved from line 80)
          endTrial();
          clearInterval(animate_interval);
          showImage = false;
        }
      }
      if (showImage) {
        show_next_frame();
      }
    }, interval_time);

    function show_next_frame() {
	
      // show image
	  
	  if(animate_frame == 0){		
	  	display_element.innerHTML = '<div style = "width: 900px;">'+
										'<div style="float: left;"> <img src = "'+trial.stimuli_left[animate_frame]+'" style = "width: 450px; height: auto;" id = "jspsych-animation-2images-image-left"></img>'+
										'<div style="float: right;"> <img src = "'+trial.stimuli_right[animate_frame]+'" style = "width: 450px; height: auto;" id = "jspsych-animation-2images-image-right"></img>'+
										'</div>'+
	  								'</div>';
	  }else{
	    document.getElementById("jspsych-animation-2images-image-left").src = trial.stimuli_left[animate_frame];	
	    document.getElementById("jspsych-animation-2images-image-right").src = trial.stimuli_right[animate_frame];
	  }

      current_stim_left = trial.stimuli_left[animate_frame];
	  current_stim_right = trial.stimuli_right[animate_frame];

      // record when image was shown
      animation_sequence.push({
        "stimulus_left": trial.stimuli_left[animate_frame],
		"stimulus_right": trial.stimuli_right[animate_frame],
        "time": performance.now() - startTime
      });

      if (trial.prompt !== null) {
        display_element.innerHTML += trial.prompt;
      }

      if (trial.frame_isi > 0) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-animation-2images-image-left').style.visibility = 'hidden';
		  display_element.querySelector('#jspsych-animation-2images-image-right').style.visibility = 'hidden';
          current_stim_left = 'blank';
		  current_stim_right = 'blank';
          // record when blank image was shown
          animation_sequence.push({
            "stimulus_left": 'blank',
			"stimulus_right": 'blank',
            "time": performance.now() - startTime
          });
        }, trial.frame_time);
      }
    }

    var after_response = function(info) {

      responses.push({
        key_press: info.key,
        rt: info.rt,
        stimulus_left: current_stim_left,
		stimulus_right: current_stim_right
      });

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-animation-2images-image-left').className += ' responded';
	  display_element.querySelector('#jspsych-animation-2images-image-right').className += ' responded';
    }

    // hold the jspsych response listener object in memory
    // so that we can turn off the response collection when
    // the trial ends
    var response_listener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'performance',
      persist: true,
      allow_held_key: false
    });

    function endTrial() {

      jsPsych.pluginAPI.cancelKeyboardResponse(response_listener);

      var trial_data = {
        "animation_sequence": JSON.stringify(animation_sequence),
        "responses": JSON.stringify(responses)
      };

      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();

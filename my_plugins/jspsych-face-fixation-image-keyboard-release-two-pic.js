/**
 * jspsych-fixation-image-keyboard-release
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["face-fixation-image-keyboard-release"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('face-fixation-image-keyboard-release', 'stimulus', 'image');

  plugin.info = {
    name: 'face-fixation-image-keyboard-release',
    description: '',
    parameters: {
	 picture: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Picture',
        default: undefined,
        description: 'The image above fixation and stimulus'
      },		
      pre_fixation: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Pre_fixation',
        default: undefined,
        description: 'The first image to be displayed'
      },
	  fixation: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Fixation',
        default: undefined,
        description: 'The second image to be displayed'
      },
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The target to be displayed'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
	  pre_fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Pre_fixation duration',
        default: null,
        description: 'How long to show the first image.'
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation duration',
        default: null,
        description: 'How long to show the second image.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
	
		// store response
	
    var response = {
      rt: null,
      key: null
    };		
		
		//pre-fixation-stimulus
		
			var html_1 = '<img src="'+trial.picture+'"></img>';
			var html = '<img src="'+trial.pre_fixation+'" id="jspsych-face-fixation-image-keyboard-release-stimulus" style="';
		
			if(trial.stimulus_height !== null){
			  html += 'height:'+trial.stimulus_height+'px; '
			  if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
				html += 'width: auto; ';
			  }
			}
			if(trial.stimulus_width !== null){
			  html += 'width:'+trial.stimulus_width+'px; '
			  if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
				html += 'height: auto; ';
			  }
			}	
			html +='"></img>';	
				
					// add prompt
				
			if (trial.prompt !== null){
			  html += trial.prompt;
			}
			
			if (trial.picture !== null){
			  html = html_1+"<br>" + html;
			}

					// render
				
			display_element.innerHTML = html;
	
	

		
		// display fixation
		
			// load
		jsPsych.pluginAPI.setTimeout( 
			function() {
		
			display_element.innerHTML = '';
		
			var html_2 = '<img src="'+trial.picture+'"></img>';
			var html_3 = '<img src="'+trial.fixation+'" id="jspsych-face-fixation-image-keyboard-release-stimulus" style="';
		
			if(trial.stimulus_height !== null){
			  html_3 += 'height:'+trial.stimulus_height+'px; '
			  if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
				html_3 += 'width: auto; ';
			  }
			}
			if(trial.stimulus_width !== null){
			  html_3 += 'width:'+trial.stimulus_width+'px; '
			  if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
				html_3 += 'height: auto; ';
			  }
			}	
			html_3 +='"></img>';	
				
					// add prompt
				
			if (trial.prompt !== null){
			  html_3 += trial.prompt;
			}
			
			if (trial.picture !== null){
			  html_3 = html_2+"<br>" + html_3;
			}

					// render
				
			display_element.innerHTML = html_3;
	
		  
    // display stimulus
	
				jsPsych.pluginAPI.setTimeout( 
					function() {
					
						// render
					
						document.getElementById("jspsych-face-fixation-image-keyboard-release-stimulus").src = trial.stimulus;
						
						// function to end trial when it is time
					
						var end_trial = function() {

							// kill any remaining setTimeout handlers
							
							jsPsych.pluginAPI.clearAllTimeouts();

							// kill keyboard listeners
							
							document.removeEventListener("keyup", my_response, false);

							// gather the data to store for the trial
							
							var trial_data = {
								"rt": response.rt,
								"stimulus": trial.stimulus,
								"key_press": response.key
							};

							// clear the display
							
							display_element.innerHTML = '';

							// move on to the next trial
							
							jsPsych.finishTrial(trial_data);
						};

						// function to handle responses by the subject
						
						var after_response = function(info) {

							// after a valid response, the stimulus will have the CSS class 'responded'
							// which can be used to provide visual feedback that a response was recorded
							
							display_element.querySelector('#jspsych-face-fixation-image-keyboard-release-stimulus').className += ' responded';

							// only record the first response
							
							if (response.key == null) {
								response = info;
							}

							if (trial.response_ends_trial) {
								end_trial();
							}
						};
						
						// reponse detection function
						// NOTE: keyCode is deprecated --> change to e.key or e.code (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
						// NOTE: probably best to do both (https://medium.com/@uistephen/keyboardevent-key-for-cross-browser-key-press-check-61dbad0a067a)
					
						function my_response(e){
							my_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(e.key) || e.keyCode; 
							for(var i=0; i < trial.choices.length; i++){						
								if(my_key == trial.choices[i]){
									var key_time = performance.now(); // console.log(key_time - start_time);
									after_response({
										key: my_key,
										rt: key_time - start_time
									});
									break;
								}		  
							}
						};
							
						// wait for response
						
						var start_time = performance.now();
						document.addEventListener("keyup", my_response, false);
						
						// hide stimulus if stimulus_duration is set
				
					
				
				
						if (trial.stimulus_duration !== null) {
							jsPsych.pluginAPI.setTimeout(function() {
								display_element.querySelector('#jspsych-face-fixation-image-keyboard-release-stimulus').style.visibility = 'hidden';		
							}, trial.stimulus_duration);
						}
					
						// end trial if trial_duration is set
						
						if (trial.trial_duration !== null) {
							jsPsych.pluginAPI.setTimeout(function() {
								end_trial();
							}, trial.trial_duration);
						}
					},trial.fixation_duration
				)
			},trial.pre_fixation_duration 
		)
	}	
  return plugin;
})();

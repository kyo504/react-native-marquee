import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  itemText: {
    fontSize: 18,
    color: 'black',
  },
  marqueeWrapper: {
    height: 200,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  label: {
    fontWeight: '600',
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlText: {
    marginHorizontal: 10,
  },
  arrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 100,
    marginRight: 20,
  },
});

export default styles;
